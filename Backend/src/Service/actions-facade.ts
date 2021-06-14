import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';

export default class ActionsFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = new Members();
	}

	disableAction(myUID: string, partnerUID: string, action: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) => member.disableAction(partnerUID, action));
	}

	enableAction(myUID: string, partnerUID: string, action: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) => member.enableAction(partnerUID, action));
	}

	sendHeart(myUID: string, partnerUID: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) => member.sendHeart(partnerUID, myUID));
	}
}
