import { makeFail, makeGood, ResponseMsg } from '../../response';
import ConnectionData from '../../Service/DataObjects/connection-data';
import CouponData from '../../Service/DataObjects/coupon-data';
import GoalData from '../../Service/DataObjects/goal-data';
import PartnerData from '../../Service/DataObjects/partner-data';
import ConnectionSettings from './connection-settings';
import Coupon from './Coupons/coupon';
import Goal from './Goals/goal';
import Invitation from './invitation';

const validatePartner = () => {
	return (_: unknown, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (partnerUID: string, ...args: never[]) {
			if (!(this as Member).connections[partnerUID]) {
				return makeFail('You do not have a connection with given member');
			}
			return originalMethod.apply(this, [partnerUID, ...args]);
		};

		return descriptor;
	};
};

export default class Member {
	private _invitations: { [senderUID: string]: Invitation };
	private _uid: string;
	private _nickname: string;
	private _connections: { [partnerUID: string]: ConnectionSettings };

	constructor(uid: string, nickname: string) {
		this._uid = uid;
		this._invitations = {};
		this._nickname = nickname;
		this._connections = {};
	}

	get uid(): string {
		return this._uid;
	}
	get nickname(): string {
		return this._nickname;
	}
	get invitations(): Invitation[] {
		return Object.values(this._invitations);
	}
	get connections(): { [partnerUID: string]: ConnectionSettings } {
		return this._connections;
	}

	private removeInvitation(uid: string): ResponseMsg<void> {
		delete this._invitations[uid];
		return makeGood();
	}

	invite(sender: Member): ResponseMsg<void> {
		if (this._connections[sender.uid]) {
			return makeFail('You are already partners');
		}
		if (!this._invitations[sender.uid]) {
			const invitation = new Invitation(this._uid, sender);
			this._invitations[sender.uid] = invitation;
		}
		return makeGood();
	}

	acceptInvitation(inviterUID: string): ResponseMsg<void> {
		if (!this._invitations[inviterUID]) {
			return makeFail('Has no invitation from the given user');
		}

		const mySettings = this._invitations[inviterUID].accept(this.nickname);
		this._connections[inviterUID] = mySettings;

		return this.removeInvitation(inviterUID);
	}

	@validatePartner()
	leavePartner(partnerUID: string): ResponseMsg<void> {
		delete this._connections[partnerUID];
		return makeGood();
	}

	addConnection(partnerUID: string, connection: ConnectionSettings): void {
		if (this._connections[partnerUID]) {
			throw new Error('Can not redeclare connections');
		}
		this._connections[partnerUID] = connection;
	}

	getPartners(): PartnerData[] {
		const partners = Object.keys(this._connections).map((partnerUID) => {
			return new PartnerData(partnerUID, this._connections[partnerUID].partnerNickname);
		});
		return partners;
	}

	rejectInvitation(toRejectUID: string): ResponseMsg<void> {
		if (!this._invitations[toRejectUID]) {
			return makeFail('Has no invitation from the given user');
		}

		return this.removeInvitation(toRejectUID);
	}

	hasInvitation(fromUID: string): boolean {
		return this._invitations[fromUID] !== undefined;
	}

	@validatePartner()
	createCoupon(partnerUID: string, content: string): ResponseMsg<string> {
		return this._connections[partnerUID].onPartner((partner) => partner.createCoupon(content));
	}

	@validatePartner()
	getPartnersAvailable(partnerUID: string): ResponseMsg<Coupon[], CouponData[]> {
		return this._connections[partnerUID].onPartner((partner) =>
			makeGood(partner.availableCoupons)
		);
	}

	@validatePartner()
	removeCoupon(partnerUID: string, couponId: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.removeCoupon(couponId));
	}

	@validatePartner()
	editCoupon(partnerUID: string, couponID: string, newContent: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) =>
			partner.editCoupon(couponID, newContent)
		);
	}

	@validatePartner()
	setCouponRarity(partnerUID: string, couponID: string, rarityName: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) =>
			partner.setCouponRarity(couponID, rarityName)
		);
	}

	@validatePartner()
	setRandomCouponPrice(partnerUID: string, price: number): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) =>
			partner.setRandomCouponPrice(price)
		);
	}

	@validatePartner()
	getConnection(partnerUID: string): ResponseMsg<ConnectionData> {
		return this._connections[partnerUID].getConnection();
	}

	@validatePartner()
	sendPoints(partnerUID: string, points: number): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.addPoints(points));
	}

	@validatePartner()
	drawCoupon(partnerUID: string): ResponseMsg<CouponData> {
		return this._connections[partnerUID].drawCoupon();
	}

	@validatePartner()
	getEarnedCoupon(partnerUID: string): ResponseMsg<CouponData[]> {
		const response: ResponseMsg<Coupon[], CouponData[]> = makeGood(
			this._connections[partnerUID].earnedCoupons
		);
		return response.parse();
	}

	@validatePartner()
	sendCoupon(partnerUID: string, content: string): ResponseMsg<string> {
		return this._connections[partnerUID].onPartner((partner) => partner.earnCoupon(content));
	}

	@validatePartner()
	addGoalToPartner(partnerUID: string, goal: string, reward: number): ResponseMsg<string> {
		return this._connections[partnerUID].onPartner((partner) => partner.addGoal(goal, reward));
	}

	@validatePartner()
	getMyGoals(partnerUID: string): ResponseMsg<GoalData[]> {
		const response: ResponseMsg<Goal[], GoalData[]> = makeGood(
			this._connections[partnerUID].goals
		);
		return response.parse();
	}

	@validatePartner()
	removeGoal(partnerUID: string, goalID: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.removeGoal(goalID));
	}

	@validatePartner()
	setGoalReward(partnerUID: string, goalID: string, reward: number): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) =>
			partner.setGoalReward(goalID, reward)
		);
	}

	@validatePartner()
	completeGoal(partnerUID: string, goalID: string): ResponseMsg<void> {
		return this._connections[partnerUID].completeGoal(goalID);
	}

	@validatePartner()
	approveGoal(partnerUID: string, goalID: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.approveGoal(goalID));
	}

	@validatePartner()
	incompleteGoal(partnerUID: string, goalID: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.incompleteGoal(goalID));
	}

	@validatePartner()
	disableAction(partnerUID: string, action: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.disableAction(action));
	}

	@validatePartner()
	enableAction(partnerUID: string, action: string): ResponseMsg<void> {
		return this._connections[partnerUID].onPartner((partner) => partner.enableAction(action));
	}

	@validatePartner()
	sendHeart(partnerUID: string, senderUID: string): ResponseMsg<void> {
		return this._connections[partnerUID].sendHeart(senderUID);
	}
}
