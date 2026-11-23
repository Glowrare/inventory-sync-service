import { Router } from 'express';
import { ServiceError } from '../errors.js';
export function inventoryRoutes(service) {
  const router = Router();
  router.get('/inventory', (_request, response) => response.json({ items: service.list() }));
  router.get('/inventory/:id', (request, response) => {
    const item = service.find(request.params.id);
    if (!item) throw new ServiceError('NOT_FOUND');
    response.json({ item });
  });
  router.get('/sync/status', (_request, response) => response.json(service.status()));
  router.post('/sync', async (_request, response) => response.json(await service.synchronize()));
  return router;
}
