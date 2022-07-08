import settings from '../../../settings';
import { makeFail, makeGood, Parsable, ResponseMsg } from '../../response';
import ConnectionData from '../../Service/DataObjects/connection-data';
import Data from '../../Service/DataObjects/connection-settings-data';
import CouponData from '../../Service/DataObjects/coupon-data';
import Actions from './actions';
import Connection from './connection';
import Coupon from './Coupons/coupon';
import CouponsBank from './Coupons/coupons-bank';
import Goal from './Goals/goal';
import Goals from './Goals/goals';

export default class ConnectionSettings implements Parsable<ConnectionSettings, Data> {
	private _partner: ConnectionSettings | null;
	private _connection: Connection;
	private _partnerNickname: string;
	private _couponsBank: CouponsBank;
	private _goals: Goals;
	private _randomCouponPrice: number;
	private _points: number;
	private _actions: Actions;

	constructor(connection: Connection, partnerNickname: string) {
		this._partner = null;
		this._connection = connection;
		this._partnerNickname = partnerNickname;
		this._randomCouponPrice = settings.defaults.randomCouponPrice;
		this._points = 0;
		this._couponsBank = new CouponsBank();
		this._goals = new Goals();
		this._actions = new Actions();
	}

	get partnerNickname(): string {
		return this._partnerNickname;
	}

	get availableCoupons(): Coupon[] {
		return this._couponsBank.availableCoupons;
	}

	get earnedCoupons(): Coupon[] {
		return this._couponsBank.earnedCoupon;
	}

	get goals(): Goal[] {
		return this._goals.goals;
	}

	private get partner(): ConnectionSettings {
		if (!this._partner) {
			throw new Error('Connection settings has not been set with a partner');
		}
		return this._partner;
	}

	parse(): Data {
		return new Data(
			this._points,
			this._randomCouponPrice,
			this._partnerNickname,
			this._actions.parse()
		);
	}

	getData(): ConnectionSettings {
		return this;
	}

	setPartner(partner: ConnectionSettings): void {
		if (this._partner) {
			throw new Error('Can not change partners in connection settings');
		}
		this._partner = partner;
	}

	onPartner<T, U>(
		funcToDelegate: (partner: ConnectionSettings) => ResponseMsg<T, U>
	): ResponseMsg<T, U> {
		return funcToDelegate(this.partner);
	}

	createCoupon(content: string): ResponseMsg<string> {
		return this._couponsBank.createCoupon(content);
	}

	removeCoupon(couponId: string): ResponseMsg<void> {
		return this._couponsBank.removeCoupon(couponId);
	}

	editCoupon(couponId: string, newContent: string): ResponseMsg<void> {
		return this._couponsBank.editCoupon(couponId, newContent);
	}

	setCouponRarity(couponID: string, rarityName: string): ResponseMsg<void> {
		return this._couponsBank.setCouponRarity(couponID, rarityName);
	}

	setRandomCouponPrice(price: number): ResponseMsg<void> {
		if (price < 0) {
			return makeFail('Can not set a negative price');
		}
		if (!Number.isInteger(price)) {
			return makeFail('Price must be a full number');
		}
		this._randomCouponPrice = price;
		return makeGood();
	}

	getConnection(): ResponseMsg<ConnectionData> {
		return makeGood(
			new ConnectionData(this.parse(), this.partner.parse(), this._connection.chatID)
		);
	}

	addPoints(points: number): ResponseMsg<void> {
		if (points <= 0) {
			return makeFail('Can not send none positive number of points');
		}
		if (!Number.isInteger(points)) {
			return makeFail('You must send a full number');
		}
		this._points += points;
		return makeGood();
	}

	drawCoupon(): ResponseMsg<CouponData> {
		if (this._points < this._randomCouponPrice) {
			return makeFail('You do not have enough points for a coupon');
		}

		const response = this._couponsBank.drawCoupon();
		response.then((_) => (this._points -= this._randomCouponPrice));

		return response;
	}

	sendCoupon(senderUID: string, content: string): ResponseMsg<string> {
		return this.partner.earnCoupon(content).then((couponID) => {
			this._connection.sendCoupon(senderUID, content);
			return couponID;
		});
	}

	earnCoupon(content: string): ResponseMsg<string> {
		return this._couponsBank.earnCoupon(content);
	}

	addGoal(goal: string, reward: number): ResponseMsg<string> {
		return this._goals.addGoal(goal, reward);
	}

	removeGoal(goalID: string): ResponseMsg<void> {
		return this._goals.removeGoal(goalID);
	}

	setGoalReward(goalID: string, reward: number): ResponseMsg<void> {
		return this._goals.setReward(goalID, reward);
	}

	completeGoal(goalID: string): ResponseMsg<void> {
		return this._goals.onGoal(goalID, (goal) => goal.complete());
	}

	approveGoal(goalID: string): ResponseMsg<void> {
		const response = this._goals.onGoal(goalID, (goal) => goal.approve());
		return response.then((reward) => {
			this._points += reward;
		});
	}

	incompleteGoal(goalID: string): ResponseMsg<void> {
		return this._goals.onGoal(goalID, (goal) => goal.incomplete());
	}

	disableAction(action: string): ResponseMsg<void> {
		return this._actions.disableAction(action);
	}

	enableAction(action: string): ResponseMsg<void> {
		return this._actions.enableAction(action);
	}

	sendHeart(senderUID: string): ResponseMsg<void> {
		const response = this._actions.sendHeart();

		return response.then((reward) => {
			return this._connection.sendHeart(senderUID).then(() => {
				this._points += reward;
			});
		});
	}

	sendMessage(senderUID: string, content: string): ResponseMsg<void> {
		const response = this._actions.sendMessage();

		return response.then((reward) => {
			return this._connection.sendMessage(senderUID, content).then(() => {
				this._points += reward;
			});
		});
	}

	sendPicture(senderUID: string, pictureURI: string): ResponseMsg<void> {
		const response = this._actions.sendPicture();

		return response.then((reward) => {
			return this._connection.sendPicture(senderUID, pictureURI).then(() => {
				this._points += reward;
			});
		});
	}

	sendVideo(senderUID: string, videoURI: string): ResponseMsg<void> {
		const response = this._actions.sendVideo();

		return response.then((reward) => {
			return this._connection.sendVideo(senderUID, videoURI).then(() => {
				this._points += reward;
			});
		});
	}

	sendCouponAction(senderUID: string, content: string): ResponseMsg<void> {
		const response = this._actions.sendCoupon();

		return response.then((reward) => {
			return this.sendCoupon(senderUID, content).then(() => {
				this._points += reward;
			});
		});
	}

	setActionReward(actionName: string, reward: number): ResponseMsg<void> {
		return this._actions.setReward(actionName, reward);
	}

	setTimer(newTimer: number): ResponseMsg<void> {
		return this._actions.setTimer(newTimer);
	}
}
