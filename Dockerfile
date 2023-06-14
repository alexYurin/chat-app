FROM node:18-alpine
WORKDIR /var/www
COPY . ./
CMD yarn && yarn start
EXPOSE 3000
