FROM node:17

WORKDIR /usr/src/app

COPY app/package.json ./
COPY app/package-lock.json ./
RUN npm install

COPY app .

EXPOSE 8000

CMD [ "npm", "start" ]