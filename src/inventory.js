import { ServiceError } from './errors.js';
const invalid = () => { throw new ServiceError('SUPPLIER_INVALID_RESPONSE'); };
const key = (item) => JSON.stringify([item.supplierId, item.sku]);

export function mapSupplierStock(payload, inventory, suppliers) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) invalid();
  if (payload.items.length !== inventory.length) invalid();
  const supplierIds = new Set(suppliers.map((supplier) => supplier.id));
  const inventoryKeys = new Set(inventory.map(key));
  const stock = new Map();
  for (const item of payload.items) {
    if (!item || typeof item !== 'object' || typeof item.supplierId !== 'string' ||
        typeof item.sku !== 'string' || !supplierIds.has(item.supplierId) ||
        !Number.isSafeInteger(item.availableQuantity) || item.availableQuantity < 0 ||
        !Number.isSafeInteger(item.unitCostCents) || item.unitCostCents < 0) invalid();
    const itemKey = key(item);
    if (!inventoryKeys.has(itemKey) || stock.has(itemKey)) invalid();
    stock.set(itemKey, item);
  }
  return inventory.map((item) => {
    const remote = stock.get(key(item));
    if (!remote) invalid();
    return { ...item, quantity: remote.availableQuantity, unitCostCents: remote.unitCostCents };
  });
}

export function createInventoryService({ inventory, suppliers, supplierClient, clock = () => new Date() }) {
  let items = structuredClone(inventory);
  const supplierRecords = structuredClone(suppliers);
  const status = { state: 'idle', lastAttemptAt: null, lastSuccessAt: null, lastErrorCode: null };
  return {
    list: () => structuredClone(items),
    find: (id) => structuredClone(items.find((item) => item.id === id)),
    status: () => structuredClone(status),
    async synchronize() {
      if (status.state === 'syncing') throw new ServiceError('SYNC_IN_PROGRESS');
      status.state = 'syncing';
      status.lastAttemptAt = clock().toISOString();
      status.lastErrorCode = null;
      try {
        const payload = await supplierClient.fetchStock();
        const nextItems = mapSupplierStock(payload, items, supplierRecords);
        const completedAt = clock().toISOString();
        items = nextItems;
        status.state = 'succeeded';
        status.lastSuccessAt = completedAt;
        return { updatedCount: items.length, synchronizedAt: completedAt };
      } catch (error) {
        const safe = error instanceof ServiceError ? error : new ServiceError('INTERNAL_ERROR');
        status.state = 'failed';
        status.lastErrorCode = safe.code;
        throw safe;
      }
    }
  };
}
