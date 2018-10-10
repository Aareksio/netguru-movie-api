import * as dotenv from 'dotenv';
dotenv.config();

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import { RegisterRoutes } from './routes';
import { createConnection } from 'typeorm';

import './controllers/commentsController';
import './controllers/moviesController';

createConnection().then(async connection => {
  const app = new Koa();

  const router = new Router();
  RegisterRoutes(router);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.on('error', (err, ctx) => {
    console.error(err);
  });

  app.listen(3000);

  console.log(`Movie api running on port ${3000}`);
});
