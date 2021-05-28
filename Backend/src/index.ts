import express, { RequestHandler } from 'express';

import config from './config';

import AuthController from './Network/AuthController';
import Controller from './Network/controller';
import Server from './Network/Server';

const app = express();
const server = new Server(app, config.PORT);

const controllers: Array<Controller> = [new AuthController()];

const globalMiddleware: Array<RequestHandler> = [];

Promise.resolve()
	.then(() => {
		server.loadGlobalMiddleware(globalMiddleware);
		server.loadControllers(controllers);
		server.run();
	})
	.catch((reason) => {
		console.error(reason);
	});
