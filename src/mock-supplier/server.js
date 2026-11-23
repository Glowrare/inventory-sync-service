import { createMockSupplier } from './app.js';
import { portFromEnvironment, startLocalServer } from '../runtime.js';
startLocalServer(createMockSupplier(), portFromEnvironment('SUPPLIER_PORT', 3001), 'Synthetic supplier');
