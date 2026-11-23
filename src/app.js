import express from 'express';
import { loadFixtures } from './fixtures.js';
import { createInventoryService } from './inventory.js';
import { createSupplierClient } from './supplier-client.js';
import { publicError, ServiceError } from './errors.js';
import { inventoryRoutes } from './routes/inventory.js';
export function createApp({ fixtures = loadFixtures(), supplierClient = createSupplierClient(), clock } = {}) {
  const service = createInventoryService({ ...fixtures, supplierClient, clock });
  const app = express();
  app.disable('x-powered-by');
  app.use(inventoryRoutes(service));
  app.use((_request, _response, next) => next(new ServiceError('NOT_FOUND')));
  app.use((error, _request, response, _next) => {
    const safe = publicError(error);
    response.status(safe.status).json(safe.body);
  });
  return app;
}
