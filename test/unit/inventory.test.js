import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtures } from '../../src/fixtures.js';
import { createInventoryService, mapSupplierStock } from '../../src/inventory.js';
import { ServiceError, publicError } from '../../src/errors.js';

test('mapping uses supplier and SKU, preserves identities, accepts zero, and leaves inputs unchanged', () => {
  const fixtures = loadFixtures();
  const original = structuredClone(fixtures);
  const result = mapSupplierStock(fixtures.stock, fixtures.inventory, fixtures.suppliers);
  assert.deepEqual(result.map((item) => item.quantity), [24, 0, 9]);
  assert.deepEqual(result.map((item) => item.unitCostCents), [310, 80, 1100]);
  for (let index = 0; index < result.length; index++) {
    const { quantity, unitCostCents, ...identity } = result[index];
    const { quantity: oldQuantity, unitCostCents: oldCost, ...oldIdentity } = fixtures.inventory[index];
    assert.deepEqual(identity, oldIdentity);
  }
  assert.deepEqual(fixtures, original);
});

const invalidCases = [
  ['null response', () => null],
  ['non-object JSON', () => 'invalid'],
  ['missing items', () => ({})],
  ['items is not an array', () => ({ items: {} })],
  ['incomplete snapshot', (data) => { data.items.pop(); return data; }],
  ['null item', (data) => { data.items[0] = null; return data; }],
  ['missing SKU', (data) => { delete data.items[0].sku; return data; }],
  ['unknown supplier', (data) => { data.items[0].supplierId = 'sup-unknown'; return data; }],
  ['unknown SKU', (data) => { data.items[0].sku = 'SYN-UNKNOWN'; return data; }],
  ['duplicate mapping', (data) => { data.items[1] = { ...data.items[0] }; return data; }],
  ['negative quantity', (data) => { data.items[0].availableQuantity = -1; return data; }],
  ['fractional quantity', (data) => { data.items[0].availableQuantity = 1.5; return data; }],
  ['numeric string', (data) => { data.items[0].availableQuantity = '9'; return data; }],
  ['missing cost', (data) => { delete data.items[0].unitCostCents; return data; }],
  ['fractional cost', (data) => { data.items[0].unitCostCents = 1.5; return data; }],
  ['negative cost', (data) => { data.items[0].unitCostCents = -1; return data; }],
  ['unsafe integer', (data) => { data.items[0].availableQuantity = Number.MAX_SAFE_INTEGER + 1; return data; }]
];
for (const [name, change] of invalidCases) {
  test('rejects ' + name, () => {
    const fixtures = loadFixtures();
    assert.throws(() => mapSupplierStock(change(fixtures.stock), fixtures.inventory, fixtures.suppliers),
      { code: 'SUPPLIER_INVALID_RESPONSE', status: 502 });
  });
}

test('store returns copies and does not mutate fixture records', async () => {
  const fixtures = loadFixtures();
  const original = structuredClone(fixtures);
  const service = createInventoryService({ ...fixtures, supplierClient: { fetchStock: async () => fixtures.stock } });
  service.list()[0].name = 'changed';
  service.find('inv-001').quantity = 999;
  service.status().state = 'changed';
  assert.equal(service.list()[0].name, fixtures.inventory[0].name);
  assert.equal(service.find('inv-001').quantity, 12);
  assert.equal(service.find('missing'), undefined);
  assert.equal(service.status().state, 'idle');
  await service.synchronize();
  assert.deepEqual(fixtures, original);
});

test('failed synchronization is atomic, retains last success, and supports recovery', async () => {
  const fixtures = loadFixtures();
  let payload = fixtures.stock;
  let now = new Date('2026-01-01T00:00:00Z');
  const service = createInventoryService({ ...fixtures, clock: () => now,
    supplierClient: { fetchStock: async () => payload } });
  await service.synchronize();
  const previous = service.list();
  const lastSuccessAt = service.status().lastSuccessAt;
  payload = structuredClone(fixtures.stock);
  payload.items[0].availableQuantity = 999;
  payload.items[2].unitCostCents = -1;
  now = new Date('2026-01-01T00:01:00Z');
  await assert.rejects(service.synchronize(), { code: 'SUPPLIER_INVALID_RESPONSE' });
  assert.deepEqual(service.list(), previous);
  assert.deepEqual(service.status(), { state: 'failed', lastAttemptAt: now.toISOString(),
    lastSuccessAt, lastErrorCode: 'SUPPLIER_INVALID_RESPONSE' });
  payload = fixtures.stock;
  await service.synchronize();
  assert.equal(service.status().state, 'succeeded');
  assert.equal(service.status().lastErrorCode, null);
  assert.equal(service.status().lastSuccessAt, now.toISOString());
});

test('overlapping synchronizations reject without corrupting the active attempt', async () => {
  const fixtures = loadFixtures();
  let finish;
  const service = createInventoryService({ ...fixtures,
    supplierClient: { fetchStock: () => new Promise((resolve) => { finish = resolve; }) } });
  const active = service.synchronize();
  assert.equal(service.status().state, 'syncing');
  await assert.rejects(service.synchronize(), { code: 'SYNC_IN_PROGRESS', status: 409 });
  assert.equal(service.status().state, 'syncing');
  finish(fixtures.stock);
  await active;
  assert.equal(service.status().state, 'succeeded');
});

test('unexpected exceptions become sanitized service failures', async () => {
  const fixtures = loadFixtures();
  const marker = 'SYNTHETIC_PRIVATE_MARKER';
  const service = createInventoryService({ ...fixtures,
    supplierClient: { fetchStock: async () => { throw new Error(marker); } } });
  await assert.rejects(service.synchronize(), { code: 'INTERNAL_ERROR' });
  assert.equal(service.status().lastErrorCode, 'INTERNAL_ERROR');
  assert.deepEqual(service.list(), fixtures.inventory);
  assert.equal(JSON.stringify(publicError(new Error(marker))).includes(marker), false);
  const mutated = new ServiceError('SUPPLIER_UNAVAILABLE');
  mutated.message = marker;
  assert.equal(JSON.stringify(publicError(mutated)).includes(marker), false);
  assert.equal(publicError(new ServiceError('unknown')).status, 500);
});
