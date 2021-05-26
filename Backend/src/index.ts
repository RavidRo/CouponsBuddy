import express, { RequestHandler } from 'express';
import AuthController from './service/AuthController';
import Controller from './service/controller';
import Server from './service/Server';

const PORT = 3001;
const app = express();
const server = new Server(app, PORT);

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
