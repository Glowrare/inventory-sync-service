import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../../src/app.js';
import { createMockSupplier } from '../../src/mock-supplier/app.js';
import { createSupplierClient } from '../../src/supplier-client.js';
import { loadFixtures } from '../../src/fixtures.js';
import { listen, jsonRequest } from '../../support/http.js';

async function setup(t, supplierHandler, timeout = 1500) {
  const upstream = await listen(t, supplierHandler);
  const api = await listen(
    t,
    createApp({
      supplierClient: createSupplierClient({
        baseURL: upstream.baseURL,
        timeout,
      }),
    }),
  );
  return { ...api, upstream };
}

function assertSafeFailure(response, status, code) {
  assert.equal(response.status, status);
  assert.equal(response.body.error.code, code);
  assert.deepEqual(Object.keys(response.body), ['error']);
  assert.deepEqual(Object.keys(response.body.error).sort(), [
    'code',
    'message',
  ]);
  for (const fragment of [
    'SYNTHETIC_PRIVATE_MARKER',
    'AxiosError',
    '127.0.0.1',
    'stack',
    'ECONNREFUSED',
  ]) {
    assert.equal(
      response.raw.includes(fragment),
      false,
      'must omit ' + fragment,
    );
  }
}

test('real supplier and API list, find, synchronize, and expose successful status', async (t) => {
  const fixtures = loadFixtures();
  const { baseURL } = await setup(t, createMockSupplier());
  assert.deepEqual((await jsonRequest(baseURL, '/inventory')).body, {
    items: fixtures.inventory,
  });
  assert.deepEqual((await jsonRequest(baseURL, '/inventory/inv-001')).body, {
    item: fixtures.inventory[0],
  });
  assert.equal((await jsonRequest(baseURL, '/sync/status')).body.state, 'idle');
  const synchronized = await jsonRequest(baseURL, '/sync', 'POST');
  assert.equal(synchronized.status, 200);
  assert.equal(synchronized.body.updatedCount, 3);
  assert.equal(
    Number.isNaN(Date.parse(synchronized.body.synchronizedAt)),
    false,
  );
  const inventory = (await jsonRequest(baseURL, '/inventory')).body.items;
  assert.deepEqual(
    inventory.map((item) => item.quantity),
    [24, 0, 9],
  );
  const status = (await jsonRequest(baseURL, '/sync/status')).body;
  assert.equal(status.state, 'succeeded');
  assert.equal(status.lastSuccessAt, synchronized.body.synchronizedAt);
  assert.equal(status.lastErrorCode, null);
  const repeated = await jsonRequest(baseURL, '/sync', 'POST');
  assert.equal(repeated.status, 200);
  assert.deepEqual(
    (await jsonRequest(baseURL, '/inventory')).body.items,
    inventory,
  );
});

test('unknown item and unknown route return sanitized 404s', async (t) => {
  const { baseURL } = await setup(t, createMockSupplier());
  for (const path of ['/inventory/missing', '/missing']) {
    assertSafeFailure(await jsonRequest(baseURL, path), 404, 'NOT_FOUND');
  }
});

for (const [name, body, contentType] of [
  ['malformed JSON', '{"items": SYNTHETIC_PRIVATE_MARKER', 'application/json'],
  ['HTML response', '<h1>SYNTHETIC_PRIVATE_MARKER</h1>', 'text/html'],
  [
    'invalid stock',
    JSON.stringify({ items: [{ diagnostic: 'SYNTHETIC_PRIVATE_MARKER' }] }),
    'application/json',
  ],
]) {
  test(name + ' produces a safe 502 and preserves inventory', async (t) => {
    const { baseURL } = await setup(t, (_request, response) => {
      response.writeHead(200, { 'content-type': contentType });
      response.end(body);
    });
    const previous = (await jsonRequest(baseURL, '/inventory')).body;
    assertSafeFailure(
      await jsonRequest(baseURL, '/sync', 'POST'),
      502,
      'SUPPLIER_INVALID_RESPONSE',
    );
    assert.deepEqual((await jsonRequest(baseURL, '/inventory')).body, previous);
    const status = await jsonRequest(baseURL, '/sync/status');
    assert.equal(status.body.state, 'failed');
    assert.equal(status.body.lastSuccessAt, null);
    assert.equal(status.raw.includes('SYNTHETIC_PRIVATE_MARKER'), false);
  });
}

test('upstream HTTP errors do not expose response bodies', async (t) => {
  const { baseURL } = await setup(t, (_request, response) => {
    response.writeHead(503);
    response.end('SYNTHETIC_PRIVATE_MARKER');
  });
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    502,
    'SUPPLIER_UNAVAILABLE',
  );
});

test('connection refusal returns safe 502', async (t) => {
  const { baseURL, upstream } = await setup(t, createMockSupplier());
  const closed = once(upstream.server, 'close');
  upstream.server.close();
  await closed;
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    502,
    'SUPPLIER_UNAVAILABLE',
  );
  assert.equal(
    (await jsonRequest(baseURL, '/sync/status')).body.lastErrorCode,
    'SUPPLIER_UNAVAILABLE',
  );
});

test('upstream connection reset returns safe 502', async (t) => {
  const { baseURL } = await setup(t, (request) => request.socket.destroy());
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    502,
    'SUPPLIER_UNAVAILABLE',
  );
});

test('real Axios timeout returns safe 504 and retains inventory', async (t) => {
  const { baseURL } = await setup(
    t,
    (_request, response) => {
      const timer = setTimeout(
        () => response.end('SYNTHETIC_PRIVATE_MARKER'),
        1000,
      );
      response.on('close', () => clearTimeout(timer));
    },
    100,
  );
  const previous = (await jsonRequest(baseURL, '/inventory')).body;
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    504,
    'SUPPLIER_TIMEOUT',
  );
  assert.deepEqual((await jsonRequest(baseURL, '/inventory')).body, previous);
  assert.equal(
    (await jsonRequest(baseURL, '/sync/status')).body.lastErrorCode,
    'SUPPLIER_TIMEOUT',
  );
});

test('HTTP synchronization rejects overlap and recovers after upstream failure', async (t) => {
  const fixtures = loadFixtures();
  let release;
  let announce;
  const received = new Promise((resolve) => {
    announce = resolve;
  });
  let fail = true;
  const { baseURL } = await setup(t, async (_request, response) => {
    if (fail) {
      announce();
      await new Promise((resolve) => {
        release = resolve;
      });
      response.writeHead(503);
      response.end('SYNTHETIC_PRIVATE_MARKER');
    } else {
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(fixtures.stock));
    }
  });
  const active = jsonRequest(baseURL, '/sync', 'POST');
  await received;
  assert.equal(
    (await jsonRequest(baseURL, '/sync/status')).body.state,
    'syncing',
  );
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    409,
    'SYNC_IN_PROGRESS',
  );
  release();
  assertSafeFailure(await active, 502, 'SUPPLIER_UNAVAILABLE');
  fail = false;
  assert.equal((await jsonRequest(baseURL, '/sync', 'POST')).status, 200);
  assert.equal(
    (await jsonRequest(baseURL, '/sync/status')).body.lastErrorCode,
    null,
  );
});

test('unexpected internal error is sanitized by HTTP middleware', async (t) => {
  const { baseURL } = await listen(
    t,
    createApp({
      supplierClient: {
        fetchStock: async () => {
          throw new Error('SYNTHETIC_PRIVATE_MARKER');
        },
      },
    }),
  );
  assertSafeFailure(
    await jsonRequest(baseURL, '/sync', 'POST'),
    500,
    'INTERNAL_ERROR',
  );
});

test('supplier requests bypass environment HTTP proxies', async (t) => {
  const { baseURL } = await setup(t, createMockSupplier());

  let proxyHits = 0;

  const proxy = await listen(t, (_request, response) => {
    proxyHits++;
    response.writeHead(502);
    response.end('Unexpected proxy interception');
  });

  const previous = {
    HTTP_PROXY: process.env.HTTP_PROXY,
    http_proxy: process.env.http_proxy,
    NO_PROXY: process.env.NO_PROXY,
    no_proxy: process.env.no_proxy,
  };

  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  process.env.HTTP_PROXY = proxy.baseURL;
  process.env.http_proxy = proxy.baseURL;
  process.env.NO_PROXY = '';
  process.env.no_proxy = '';

  const result = await jsonRequest(baseURL, '/sync', 'POST');

  assert.equal(result.status, 200);
  assert.equal(proxyHits, 0);
});
