import express from 'express';
import { loadFixtures } from '../fixtures.js';
export function createMockSupplier({ stock = loadFixtures().stock } = {}) {
  const snapshot = structuredClone(stock);
  const app = express();
  app.disable('x-powered-by');
  app.get('/stock', (_request, response) => response.json(snapshot));
  return app;
}
