import ResponseMsg, { ParsableArrResponse } from '../../response';
import InvitationData from '../../Service/DataObjects/invitation-data';
import PartnerData from '../../Service/DataObjects/partner-data';
import Singleton from '../../singleton';
import Invitation from './invitation';

import Member from './member';

export default class Members extends Singleton {
	private members: { [uid: string]: Member } = {};

	static getInstance(): Members {
		return this.getInstanceGen(() => new Members());
	}

	register(uid: string, nickname: string): ResponseMsg<never> {
		if (this.members[uid]) {
			return ResponseMsg.makeError('User with the given uid already exists');
		}
		this.members[uid] = new Member(uid, nickname);
		return ResponseMsg.makeSuccess();
	}

	invite(fromUID: string, toUID: string): ResponseMsg<never> {
		const userTo = this.members[toUID];
		const userFrom = this.members[fromUID];
		if (!userTo || !userFrom) {
			return ResponseMsg.makeError('Users with the given uid does not exist');
		}
		// Accept the current invitation if there is one already
		if (userFrom.hasInvitation(toUID)) {
			return userFrom.acceptInvitation(toUID);
		}
		return userTo.invite(userFrom);
	}

	acceptInvitation(uid: string, inviterUID: string): ResponseMsg<never> {
		if (!this.members[uid]) {
			return ResponseMsg.makeError('User with the given uid does not exist');
		}
		return this.members[uid].acceptInvitation(inviterUID);
	}

	getInvitations(uid: string): ParsableArrResponse<InvitationData, Invitation> {
		if (!this.members[uid]) {
			return ParsableArrResponse.makeParsArrError('User with the given uid does not exist');
		}
		return ParsableArrResponse.makeParsArrSuccess(this.members[uid].invitations);
	}

	getPartners(uid: string): ResponseMsg<PartnerData[]> {
		if (!this.members[uid]) {
			return ResponseMsg.makeError('User with the given uid does not exist');
		}
		return ResponseMsg.makeSuccess(this.members[uid].getPartners());
	}
	rejectInvitation(uid: string, toRejectUID: string): ResponseMsg<never> {
		if (!this.members[uid]) {
			return ResponseMsg.makeError('User with the given uid does not exist');
		}
		return this.members[uid].rejectInvitation(toRejectUID);
	}
}
