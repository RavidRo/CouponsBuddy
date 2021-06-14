import { ResponseMsg, makeFail, makeGood } from '../../response';
import InvitationData from '../../Service/DataObjects/invitation-data';
import PartnerData from '../../Service/DataObjects/partner-data';
import Singleton from '../../singleton';
import Invitation from './invitation';

import Member from './member';

const validateUID = (checkSecond = false) => {
	return (_: unknown, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (uid: string, ...args: never[]) {
			if (
				!(this as Members).members[uid] ||
				(checkSecond && !(this as Members).members[args[0]])
			) {
				return makeFail('User with the given uid does not exist');
			}
			return originalMethod.apply(this, [uid, ...args]);
		};

		return descriptor;
	};
};

export default class Members extends Singleton {
	private _members: { [uid: string]: Member } = {};

	get members(): { [uid: string]: Member } {
		return this._members;
	}

	register(uid: string, nickname: string): ResponseMsg<void> {
		if (this._members[uid]) {
			return makeFail('User with the given uid already exists');
		}
		this._members[uid] = new Member(uid, nickname);
		return makeGood();
	}

	@validateUID(true)
	invite(fromUID: string, toUID: string): ResponseMsg<void> {
		const userTo = this._members[toUID];
		const userFrom = this._members[fromUID];

		// Accept the current invitation if there is one already
		if (userFrom.hasInvitation(toUID)) {
			return userFrom.acceptInvitation(toUID);
		}
		return userTo.invite(userFrom);
	}

	@validateUID()
	acceptInvitation(uid: string, inviterUID: string): ResponseMsg<void> {
		return this._members[uid].acceptInvitation(inviterUID);
	}

	@validateUID(true)
	leavePartner(uid: string, partnerUID: string): ResponseMsg<void> {
		const response = this._members[uid].leavePartner(partnerUID);
		return response.then(() => this._members[partnerUID].leavePartner(uid));
	}

	@validateUID()
	onMember<T, U = T>(
		uid: string,
		func: (member: Member) => ResponseMsg<T, U>
	): ResponseMsg<T, U> {
		return func(this._members[uid]);
	}

	@validateUID()
	getInvitations(uid: string): ResponseMsg<Invitation[], InvitationData[]> {
		return makeGood(this._members[uid].invitations);
	}

	@validateUID()
	getPartners(uid: string): ResponseMsg<PartnerData[]> {
		return makeGood(this._members[uid].getPartners());
	}
}
