FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "build"]
