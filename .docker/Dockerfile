FROM node:17

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY .env .
COPY ./app .

# Preload dotenv
# CMD ["node", "-r", "dotenv/config", "app.js"]

# se define el puerto
EXPOSE 8000

# se ejecuta el backend
ENTRYPOINT [ "/bin/bash" ]