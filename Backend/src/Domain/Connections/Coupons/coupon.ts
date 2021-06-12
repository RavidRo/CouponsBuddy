import { v4 as uuid } from 'uuid';
import { makeFail, makeGood, Parsable, ResponseMsg } from '../../../response';
import CouponData from '../../../Service/DataObjects/coupon-data';
import Rarity from './rarity';

export default class Coupon implements Parsable<Coupon, CouponData> {
	private _content: string;
	private _id: string;
	private _rarity: Rarity;

	constructor(content: string) {
		this._content = content;
		this._id = uuid();
		this._rarity = Rarity.getDefault();
	}

	get id(): string {
		return this._id;
	}

	get rarityName(): string {
		return this._rarity.name;
	}

	getData(): Coupon {
		return this;
	}

	parse(): CouponData {
		return new CouponData(this._id, this._content, this._rarity.parse());
	}

	editCoupon(newContent: string): ResponseMsg<null> {
		if (newContent.length <= 0) {
			return makeFail('Coupons must have content');
		}
		this._content = newContent;
		return makeGood();
	}

	setRarity(rarityName: string): ResponseMsg<null> {
		const rarity = Rarity.getRarityByName(rarityName);
		if (!rarity) {
			return makeFail(`Rarity ${rarityName} does not exist`);
		}
		this._rarity = rarity;
		return makeGood();
	}
}
