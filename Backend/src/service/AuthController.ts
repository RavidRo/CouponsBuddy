import { Response, Request, NextFunction } from 'express';
import Controller, { Method } from './Controller';

export default class AuthController extends Controller {
	path = '/auth'; // The path on which this.routes will be mapped
	routes = [
		{
			path: '/login', // Will become /auth/login
			method: Method.POST,
			handler: this.handleLogin,
			localMiddleware: [],
		},
		// Other routes...
	];

	constructor() {
		super();
	}

	async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { username, password } = req.body; // Get credentials from client
			console.log(username, password, res, next);
		} catch (e) {
			// Handle error
		}
	}
	// Other handlers...
}
