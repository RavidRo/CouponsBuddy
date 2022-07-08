import { Request } from 'express';
import { ResponseMsg } from '../../response';
import MessagingFacade from '../../Service/messaging-facade';
import Controller, { Method } from '../Controller';
import { authenticate } from '../Middleware';

export default class PartnersController extends Controller {
	private messaging: MessagingFacade;

	path = '/partners'; // The path on which this.routes will be mapped
	routes = [
		{
			path: '/invite',
			method: Method.POST,
			handler: this.invite,
			localMiddleware: [authenticate],
		},
	];

	constructor() {
		super();
		this.messaging = new MessagingFacade();
	}

	invite(req: Request): ResponseMsg<void> {
		const { myUID, partnerUID } = req.body;
		return this.validateArgs(this.messaging.sendMessage, myUID, partnerUID);
	}
}
