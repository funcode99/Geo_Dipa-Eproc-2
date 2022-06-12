# FROM node:14.10.1-alpine3.12
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]

FROM node:14.10.1-alpine3.12 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG REACT_APP_NAME
ENV REACT_APP_NAME=$REACT_APP_NAME
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
