FROM node:24-bookworm-slim@sha256:873f586f3794f52281bd039bf02c048a0be08fde619338f9941bad1eb6b34530

USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
RUN mkdir -p /workspace/node_modules \
  && chown -R node:node /workspace

COPY --chown=node:node package.json package-lock.json ./
USER node
RUN node --version && npm --version \
  && test "$(node --version)" = "v24.22.3" \
  && test "$(npm --version)" = "11.19.1" \
  && npm ci --ignore-scripts --no-audit --no-fund

COPY --chown=node:node src ./src
COPY --chown=node:node fixtures ./fixtures

CMD [ "sleep", "infinity" ]