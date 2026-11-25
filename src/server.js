import { createApp } from './app.js';
import { createSupplierClient } from './supplier-client.js';
import { portFromEnvironment, startLocalServer } from './runtime.js';

const supplierPort = portFromEnvironment('SUPPLIER_PORT', 3001);
const baseURL =
  process.env.SUPPLIER_BASE_URL ?? 'http://127.0.0.1:' + supplierPort;

startLocalServer(
  createApp({
    supplierClient: createSupplierClient({
      baseURL,
    }),
  }),
  portFromEnvironment('PORT', 3000),
  'Inventory Sync Service',
);
