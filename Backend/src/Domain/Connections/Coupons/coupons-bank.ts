import { makeFail, makeGood, ResponseMsg } from '../../../response';
import CouponData from '../../../Service/DataObjects/coupon-data';
import Coupon from './Coupon';
import Rarity from './rarity';

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

	get earnedCoupon(): Coupon[] {
		return Object.values(this._earnedCoupons);
	}

	createCoupon(content: string): ResponseMsg<string> {
		if (content.length <= 0) {
			return makeFail('Coupons must have content');
		}
		const coupon = new Coupon(content);
		this._availableCoupons[coupon.id] = coupon;
		return makeGood(coupon.id);
	}

	removeCoupon(couponId: string): ResponseMsg<null> {
		if (!(couponId in this._availableCoupons)) {
			return makeFail('Given coupon does not exists in the bank of your partner');
		}
		delete this._availableCoupons[couponId];
		return makeGood();
	}

	editCoupon(couponId: string, newContent: string): ResponseMsg<null> {
		if (!(couponId in this._availableCoupons)) {
			return makeFail('Given coupon does not exists in the bank of your partner');
		}
		return this._availableCoupons[couponId].editCoupon(newContent);
	}

	setCouponRarity(couponID: string, rarityName: string): ResponseMsg<null> {
		if (!(couponID in this._availableCoupons)) {
			return makeFail('Given coupon does not exists in the bank of your partner');
		}
		return this._availableCoupons[couponID].setRarity(rarityName);
	}

	drawCoupon(): ResponseMsg<CouponData> {
		if (Object.keys(this._availableCoupons).length === 0) {
			return makeFail('You partner did not set any coupons for you to draw from');
		}
		const raritiesNames = this.availableCoupons.map((coupon) => coupon.rarityName);
		const randomRarityName = Rarity.getRandomRarityName(raritiesNames);
		const randomCoupon = this.availableCoupons.find(
			(coupon) => coupon.rarityName === randomRarityName
		);

		if (!randomCoupon) {
			throw new Error('Something went wrong when matching between rarities and names');
		}
		this._earnedCoupons[randomCoupon.id] = randomCoupon;
		return makeGood(randomCoupon.parse());
	}

	earnCoupon(content: string): ResponseMsg<string> {
		const newCoupon = new Coupon(content);
		this._earnedCoupons[newCoupon.id] = newCoupon;
		return makeGood(newCoupon.id);
	}
}
