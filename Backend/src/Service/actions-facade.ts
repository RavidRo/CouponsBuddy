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

	sendMessage(myUID: string, partnerUID: string, content: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.sendMessage(partnerUID, myUID, content)
		);
	}

	sendPicture(myUID: string, partnerUID: string, pictureURI: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.sendPicture(partnerUID, myUID, pictureURI)
		);
	}

	sendVideo(myUID: string, partnerUID: string, videoURI: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.sendVideo(partnerUID, myUID, videoURI)
		);
	}

	sendCoupon(myUID: string, partnerUID: string, content: string): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.sendCouponAction(partnerUID, myUID, content)
		);
	}

	setReward(
		myUID: string,
		partnerUID: string,
		actionName: string,
		reward: number
	): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.setActionReward(partnerUID, actionName, reward)
		);
	}

	setPartnerTimer(myUID: string, partnerUID: string, newTimer: number): ResponseMsg<void> {
		return this.members.onMember(myUID, (member) =>
			member.setPartnerTimer(partnerUID, newTimer)
		);
	}
}
