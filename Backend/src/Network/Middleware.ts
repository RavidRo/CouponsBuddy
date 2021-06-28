import { Response, Request, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
	console.log('WOW');
	next();
}
