FROM node:18-alpine AS builder

# directorio de trabajo
WORKDIR /app

# que copie los archivos del front
COPY . /app/

# que instale dependencias
RUN npm install

# crear el react
RUN npm run build

# exponemos la app por nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# abrimos el puerto para utilizar la app
EXPOSE 80

# iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]
