import { readFileSync } from 'node:fs';
const fixture = (name) => JSON.parse(readFileSync(new URL('../fixtures/' + name + '.json', import.meta.url), 'utf8'));
export function loadFixtures() {
  return { inventory: fixture('inventory'), suppliers: fixture('suppliers'), stock: fixture('supplier-stock') };
}
