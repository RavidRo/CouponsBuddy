import { Request } from 'express';
import { ResponseMsg } from '../../response';
import ConnectionData from '../../Service/DataObjects/connection-data';
import InvitationData from '../../Service/DataObjects/invitation-data';
import PartnerData from '../../Service/DataObjects/partner-data';
import PartnersFacade from '../../Service/partners-facade';
import Controller, { Method } from '../Controller';
import { authenticate } from '../Middleware';

export default class PartnersController extends Controller {
	private partners: PartnersFacade;

	path = '/partners'; // The path on which this.routes will be mapped
	routes = [
		{
			path: '/invite',
			method: Method.POST,
			handler: this.invite,
			localMiddleware: [authenticate],
		},
		{
			path: '/accept',
			method: Method.POST,
			handler: this.acceptInvitation,
			localMiddleware: [authenticate],
		},
		{
			path: '/leave',
			method: Method.POST,
			handler: this.leavePartner,
			localMiddleware: [authenticate],
		},
		{
			path: '/invitations',
			method: Method.GET,
			handler: this.getInvitations,
			localMiddleware: [authenticate],
		},
		{
			path: '/partners',
			method: Method.GET,
			handler: this.getPartners,
			localMiddleware: [authenticate],
		},
		{
			path: '/reject',
			method: Method.POST,
			handler: this.rejectInvitation,
			localMiddleware: [authenticate],
		},
		{
			path: '/connection',
			method: Method.GET,
			handler: this.getConnection,
			localMiddleware: [authenticate],
		},
		{
			path: '/send-points',
			method: Method.POST,
			handler: this.sendPoints,
			localMiddleware: [authenticate],
		},
	];

	constructor() {
		super();
		this.partners = new PartnersFacade();
	}

	invite(req: Request): ResponseMsg<void> {
		const { myUID, partnerUID } = req.body;
		return this.validateArgs(this.partners.invite, myUID, partnerUID);
	}

	acceptInvitation(req: Request): ResponseMsg<void> {
		const { myUID, inviterUID } = req.body;
		return this.validateArgs(this.partners.acceptInvitation, myUID, inviterUID);
	}

	leavePartner(req: Request): ResponseMsg<void> {
		const { myUID, partnerUID } = req.body;
		return this.validateArgs(this.partners.leavePartner, myUID, partnerUID);
	}

	getInvitations(req: Request): ResponseMsg<InvitationData[]> {
		const { myUID } = req.body;
		return this.validateArgs(this.partners.getInvitations, myUID);
	}

	getPartners(req: Request): ResponseMsg<PartnerData[]> {
		const { myUID } = req.body;
		return this.validateArgs(this.partners.getPartners, myUID);
	}

	rejectInvitation(req: Request): ResponseMsg<void> {
		const { myUID, toRejectUID } = req.body;
		return this.validateArgs(this.partners.rejectInvitation, myUID, toRejectUID);
	}

	getConnection(req: Request): ResponseMsg<ConnectionData> {
		const { myUID, partnerUID } = req.body;
		return this.validateArgs(this.partners.getConnection, myUID, partnerUID);
	}

	sendPoints(req: Request): ResponseMsg<void> {
		const { myUID, partnerUID, points } = req.body;
		return this.validateArgs(this.partners.sendPoints, myUID, partnerUID, points);
	}
}
