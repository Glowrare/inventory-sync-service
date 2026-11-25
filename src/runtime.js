export function portFromEnvironment(name, fallback) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error(name + ' must be an integer between 1 and 65535.');
  }
  return Number(value);
}

export function hostFromEnvironment() {
  const host = process.env.HOST ?? '127.0.0.1';
  if (!['127.0.0.1', '0.0.0.0'].includes(host)) {
    throw new Error('HOST must be 127.0.0.1 or 0.0.0.0');
  }
  return host;
}

export function startLocalServer(app, port, label) {
  const host = hostFromEnvironment();
  const server = app.listen(port, host, () => {
    console.log(label + ': http://' + host + ':' + port);
  });
  server.on('error', () => {
    console.error(
      label + ' could not start; check whether its local port is available.',
    );
    process.exitCode = 1;
  });
  const stop = () => server.close();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  return server;
}
