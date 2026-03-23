FROM node:22-alpine

WORKDIR /backend

ARG dir=backend

COPY ${dir}/package*.json .

RUN npm install

EXPOSE 5000

COPY ${dir}/ .
CMD ["npm", "start"]