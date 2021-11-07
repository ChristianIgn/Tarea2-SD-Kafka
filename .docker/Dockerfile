FROM node:17


WORKDIR /opt/node/app

COPY app/package*.json ./

RUN npm install

COPY .env .
COPY ./app .

USER node

# CMD ["node", "-r", "dotenv/config", "app.js"]

EXPOSE 8000

ENTRYPOINT [ "/bin/bash" ]