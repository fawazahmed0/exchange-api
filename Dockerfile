FROM node:24-slim

ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

RUN npx playwright install firefox --with-deps && chmod -R 755 /ms-playwright

RUN npm install -g pm2

COPY . .

RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --create-home --home-dir /home/appuser appuser \
    && chown -R appuser:appgroup /app /ms-playwright

USER appuser
ENV HOME=/home/appuser

EXPOSE 4000

CMD ["pm2-runtime", "ecosystem.config.cjs"]
