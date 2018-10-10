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

  const port = parseInt(process.env.APP_PORT || '3000', 10);
  app.listen(port);

  console.log(`Movie api running on port ${port}`);
});
