import { makeFail, makeGood, makeGoodPr, ResponseMsg } from '../../response';
import Coupon from './Coupon';

export default class CouponsBank {
	private _availableCoupons: { [id: string]: Coupon };
	private _earnedCoupons: { [id: string]: Coupon };

	constructor() {
		this._availableCoupons = {};
		this._earnedCoupons = {};
	}

	get availableCoupons(): Coupon[] {
		return Object.values(this._availableCoupons);
	}

	createCoupon(content: string): ResponseMsg<string> {
		if (content.length <= 0) {
			return makeFail('Coupons must have content');
		}
		const coupon = new Coupon(content);
		this._availableCoupons[coupon.id] = coupon;
		return makeGoodPr(coupon.id);
	}

	removeCoupon(couponId: string): ResponseMsg<null> {
		if (!(couponId in this._availableCoupons)) {
			return makeFail('Given coupon does not exists in the bank of your partner');
		}
		delete this._availableCoupons[couponId];
		return makeGood();
	}
}
