export function portFromEnvironment(name, fallback) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error(name + ' must be an integer between 1 and 65535.');
  }
  return Number(value);
}
export function startLocalServer(app, port, label) {
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(label + ': http://127.0.0.1:' + port);
  });
  server.on('error', () => {
    console.error(label + ' could not start; check whether its local port is available.');
    process.exitCode = 1;
  });
  const stop = () => server.close();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  return server;
}
