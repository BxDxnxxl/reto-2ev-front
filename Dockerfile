FROM node:18-alpine AS build-stage
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS production-stage
WORKDIR /etc/nginx

RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=wannagames.retocsv.es"

RUN echo 'server { \
    listen 80; \
    server_name wannagames.retocsv.es; \
    return 301 https://$host$request_uri; \
} \
server { \
    listen 443 ssl; \
    server_name wannagames.retocsv.es; \
    ssl_certificate /etc/nginx/ssl/nginx.crt; \
    ssl_certificate_key /etc/nginx/ssl/nginx.key; \
    \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
    \
    location /src/assets/ { \
        alias /usr/share/nginx/html/src/assets/; \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
    \
    location = /index.html { \
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \
        add_header Pragma "no-cache"; \
        add_header Expires 0; \
    } \
    \
    location ~ /\. { \
        deny all; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/src/assets /usr/share/nginx/html/src/assets

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
