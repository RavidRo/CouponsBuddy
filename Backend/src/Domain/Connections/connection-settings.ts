import { makeFail, makeGood, Parsable, ResponseMsg } from '../../response';
import ConnectionData from '../../Service/DataObjects/connection-data';
import ConnectionSettingsData from '../../Service/DataObjects/connection-settings-data';
import CouponData from '../../Service/DataObjects/coupon-data';
import Connection from './connection';
import Coupon from './Coupon';
import CouponsBank from './coupons-bank';
import defaultSettings from './Data/default-settings';
import Rarity from './rarity';

export default class ConnectionSettings
	implements Parsable<ConnectionSettings, ConnectionSettingsData>
{
	private _partner: ConnectionSettings | null;
	private _connection: Connection;
	private _partnerNickname: string;
	private _couponsBank: CouponsBank;
	private _randomCouponPrice: number;
	private _points: number;

	constructor(connection: Connection, partnerNickname: string) {
		this._partner = null;
		this._connection = connection;
		this._partnerNickname = partnerNickname;
		this._couponsBank = new CouponsBank();
		this._randomCouponPrice = defaultSettings.randomCouponPrice;
		this._points = 0;
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

	private get partner(): ConnectionSettings {
		if (!this._partner) {
			throw new Error('Connection settings has not been set with a partner');
		}
		return this._partner;
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

	removeCoupon(couponId: string): ResponseMsg<null> {
		return this._couponsBank.removeCoupon(couponId);
	}

	editCoupon(couponId: string, newContent: string): ResponseMsg<null> {
		return this._couponsBank.editCoupon(couponId, newContent);
	}

	setCouponRarity(couponID: string, rarityName: string): ResponseMsg<null> {
		return this._couponsBank.setCouponRarity(couponID, rarityName);
	}

	setRandomCouponPrice(price: number): ResponseMsg<null> {
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
		return makeGood(new ConnectionData(this.parse(), this.partner.parse()));
	}

	addPoints(points: number): ResponseMsg<null> {
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
		if (response.isSuccess()) this._points -= this._randomCouponPrice;

		return response;
	}

	parse(): ConnectionSettingsData {
		return new ConnectionSettingsData(
			this._points,
			this._randomCouponPrice,
			this._partnerNickname
		);
	}

	getData(): ConnectionSettings {
		return this;
	}
}
