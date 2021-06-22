import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';
import ConnectionData from './DataObjects/connection-data';
import InvitationData from './DataObjects/invitation-data';
import PartnerData from './DataObjects/partner-data';

export default class PartnersFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = new Members();
	}

	invite(myUID: string, toUID: string): ResponseMsg<void> {
		return this.members.invite(myUID, toUID);
	}

	acceptInvitation(myUID: string, inviterUID: string): ResponseMsg<void> {
		return this.members.acceptInvitation(myUID, inviterUID);
	}

	leavePartner(myUID: string, partnerUID: string): ResponseMsg<void> {
		return this.members.leavePartner(myUID, partnerUID);
	}

	getInvitations(myUID: string): ResponseMsg<InvitationData[]> {
		return this.members.getInvitations(myUID).parse();
	}

	getPartners(myUID: string): ResponseMsg<PartnerData[]> {
		return this.members.getPartners(myUID);
	}

	rejectInvitation(myUID: string, toRejectUID: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) => member.rejectInvitation(toRejectUID));
	}

	getConnection(myUID: string, partnerUID: string): ResponseMsg<ConnectionData> {
		return this.members.onMember(myUID, (member) => member.getConnection(partnerUID));
	}

	sendPoints(myUID: string, partnerUID: string, points: number): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) => member.sendPoints(partnerUID, points));
	}
}
