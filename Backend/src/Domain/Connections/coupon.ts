import { v4 as uuid } from 'uuid';
import { Parsable } from '../../response';
import CouponData from '../../Service/DataObjects/coupon-data';

export default class Coupon implements Parsable<Coupon, CouponData> {
	private _content: string;
	private _id: string;

	constructor(content: string) {
		this._content = content;
		this._id = uuid();
	}

	get id(): string {
		return this._id;
	}

	getData(): Coupon {
		return this;
	}

	parse(): CouponData {
		return new CouponData(this._id, this._content);
	}
}
