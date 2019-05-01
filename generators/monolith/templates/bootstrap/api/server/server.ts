import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import logger from './logger';
import {createConnection} from "typeorm";

const root = path.normalize(__dirname + '/..');
const solutionRoot = path.normalize(root + '/..');
const pino = require('express-pino-logger')({ logger: logger });
const app = express();
const cors = require('cors');
const pkg = require('../../package.json');
const ormConfig = require('../../ormconfig.json');

export default class ExpressServer {
  constructor() {
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.use(cors());
    app.use(pino);
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  async listen(port: number = parseInt(process.env.PORT || '3000')): Promise<Application> {
    //fix ORM entities path
    ormConfig.entities = ormConfig.entities.map((x: string) => `${solutionRoot}/${x}`);
    ormConfig.subscribers = ormConfig.subscribers.map((x: string) => `${solutionRoot}/${x}`);

    const welcome = (port: number) => () => logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
    const connection = await createConnection({...pkg.db, ...ormConfig});

    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
