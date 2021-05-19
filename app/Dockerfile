FROM node:15.5.1

WORKdir /appContainer

ENV PORT 3000

COPY package.json /appContainer/package.json

RUN npm install

COPY . /appContainer

CMD ["node", "app.js"]