import { Application, RequestHandler } from 'express';
import http from 'http';
import Controller from './controller';

// I used the design pattern from here:
// https://dev.to/thedenisnikulin/express-js-on-steroids-an-oop-way-for-organizing-node-js-project-starring-typescript-388p

export default class Server {
	private app: Application;
	private readonly port: number;

	constructor(app: Application, port: number) {
		this.app = app;
		this.port = port;
	}

	public run(): http.Server {
		return this.app.listen(this.port, () => {
			console.log(`Up and running on port ${this.port}`);
		});
	}

	public loadGlobalMiddleware(middleware: Array<RequestHandler>): void {
		// global stuff like cors, body-parser, etc
		middleware.forEach((mw) => {
			this.app.use(mw);
		});
	}

	public loadControllers(controllers: Array<Controller>): void {
		controllers.forEach((controller) => {
			// use setRoutes method that maps routes and returns Router object
			this.app.use(controller.path, controller.setRoutes());
		});
	}

	// public async initDatabase(): Promise<void> {
	// 	// ...
	// }
}
