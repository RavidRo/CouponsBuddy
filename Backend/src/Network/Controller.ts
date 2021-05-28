import { Response, Request, NextFunction, Router } from 'express';

// HTTP methods
export enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

// Route interface for each route in `routes` field of `Controller` class.
interface IRoute {
	path: string;
	method: Method;
	handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
	localMiddleware: ((req: Request, res: Response, next: NextFunction) => void)[];
}

export default abstract class Controller {
	//Router instance for mapping routers
	public router: Router = Router();
	// The path on with this.routes will be mapped
	public abstract path: string;
	// Array of objects which implement IRoutes interface
	protected abstract readonly routes: IRoute[] = [];

	public setRoutes = (): Router => {
		for (const route of this.routes) {
			for (const mw of route.localMiddleware) {
				this.router.use(route.path, mw);
			}
			switch (route.method) {
				case 'GET':
					this.router.get(route.path, route.handler);
					break;
				case 'POST':
					this.router.post(route.path, route.handler);
					break;
				case 'PUT':
					this.router.put(route.path, route.handler);
					break;
				case 'DELETE':
					this.router.delete(route.path, route.handler);
					break;
				default:
					throw new Error(
						'Miss match between switch cases and method enum in Controller'
					);
			}
		}

		return this.router;
	};
}
