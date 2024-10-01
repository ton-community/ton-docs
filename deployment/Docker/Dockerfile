FROM node:20.9.0 as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.23.2

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY deployment/Docker/nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/build/ /app
