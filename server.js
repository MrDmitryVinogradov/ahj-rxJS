const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const uniqid = require('uniqid');
const { faker } = require('@faker-js/faker');

const app = new Koa();
const messagesObj = {
  status: 'ok',
  timestamp: new Date().getTime(),
  messages: [],
};

function newMessage() {
  const message = {
    'id': uniqid(),
    'from': faker.internet.email(),
    'subject': `Hello from ${faker.name.firstName()}`,
    'body': faker.lorem.paragraph(),
    'recieved': new Date().getTime(),
  }
  messagesObj.timestamp = message.recieved;
  messagesObj.messages.push(message);
  console.log(message);
} 

const interval = setInterval(() => {
  newMessage()
}, Math.floor(Math.random() * 10000));

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'DELETE'],
  })
)

const router = new Router();

router.get('/messages/unread', async (ctx) => {
  ctx.response.body = JSON.stringify(messagesObj);
  ctx.response.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())

server.listen(port);
