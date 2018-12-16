FROM node:10 AS build

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:stable

COPY --from=build /app/public/ /usr/share/nginx/html
