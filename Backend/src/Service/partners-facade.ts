import { Authentication } from '../Domain/Authentication/authentication';
import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';
import InvitationData from './DataObjects/invitation-data';
import PartnerData from './DataObjects/partner-data';

export default class PartnersFacade extends Singleton {
	private auth: Authentication;
	private members: Members;

	constructor() {
		super();
		this.auth = Authentication.getInstance();
		this.members = Members.getInstance();
	}

	static getInstance(): PartnersFacade {
		return this.getInstanceGen(() => new PartnersFacade());
	}

	invite(myUID: string, toUID: string): ResponseMsg<null> {
		return this.members.invite(myUID, toUID);
	}

	acceptInvitation(myUID: string, inviterUID: string): ResponseMsg<null> {
		return this.members.acceptInvitation(myUID, inviterUID);
	}

	leavePartner(myUID: string, partnerUID: string): ResponseMsg<null> {
		return this.members.leavePartner(myUID, partnerUID);
	}

	getInvitations(myUID: string): ResponseMsg<InvitationData[]> {
		return this.members.getInvitations(myUID).parse();
	}

	getPartners(myUID: string): ResponseMsg<PartnerData[]> {
		return this.members.getPartners(myUID);
	}

	rejectInvitation(myUID: string, toRejectUID: string): ResponseMsg<null> {
		return this.members.rejectInvitation(myUID, toRejectUID);
	}
}
