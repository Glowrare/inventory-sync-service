import { createServer, request } from 'node:http';
import { once } from 'node:events';

export async function listen(t, handler) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    if (!server.listening) { resolve(); return; }
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  return { server, baseURL: 'http://127.0.0.1:' + server.address().port };
}

export function jsonRequest(baseURL, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request(baseURL + path, { method, agent: false }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        try { resolve({ status: response.statusCode, body: JSON.parse(body), raw: body }); }
        catch (error) { reject(error); }
      });
      response.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(5000, () => req.destroy(new Error('Test HTTP request exceeded deadline.')));
    req.end();
  });
}
