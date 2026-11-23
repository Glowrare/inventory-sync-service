import axios from 'axios';
import { ServiceError } from './errors.js';

export function createSupplierClient({ baseURL = 'http://127.0.0.1:3001', timeout = 1500 } = {}) {
  const client = axios.create({ baseURL, timeout, responseType: 'json' });
  return {
    async fetchStock() {
      try {
        return (await client.get('/stock')).data;
      } catch (error) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new ServiceError('SUPPLIER_TIMEOUT');
        }
        throw new ServiceError('SUPPLIER_UNAVAILABLE');
      }
    }
  };
}
