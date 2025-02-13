FROM node:22.6

RUN npm install -g npm@10.5.0

WORKDIR /app

RUN npm install dotenv

RUN npm i -g @othentic/othentic-cli

ADD ./Set_Syncer/index.js ./

ADD .env ./

ADD ./Set_Syncer/package*.json ./

RUN npm ci

ENTRYPOINT ["node", "index.js" ]
