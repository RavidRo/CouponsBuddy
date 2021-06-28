import { Response, Request, NextFunction } from 'express';
import { makeFail, ResponseMsg } from '../response';
import PartnersFacade from '../Service/partners-facade';
import Controller, { Method } from './Controller';
import { authenticate } from './Middleware';

export default class AuthController extends Controller {
	private partners: PartnersFacade;

	path = '/partners'; // The path on which this.routes will be mapped
	routes = [
		{
			path: '/invite', // Will become /auth/login
			method: Method.POST,
			handler: this.invite,
			localMiddleware: [authenticate],
		},
		// Other routes...
	];

	constructor() {
		super();
		this.partners = new PartnersFacade();
	}

	invite(req: Request): ResponseMsg<void> {
		const { myUID, partnerUID } = req.body;
		const badRequest = [myUID, partnerUID].some((value) => value === undefined);
		if (badRequest) {
			return makeFail('Missing required parameter', 400);
		}
		return this.partners.invite(myUID, partnerUID);
	}
	// Other handlers...
}
