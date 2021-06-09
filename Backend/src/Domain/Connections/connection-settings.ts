import { makeFail, makeGood, Parsable, ResponseMsg } from '../../response';
import ConnectionData from '../../Service/DataObjects/connection-data';
import ConnectionSettingsData from '../../Service/DataObjects/connection-settings-data';
import Connection from './connection';
import Coupon from './Coupon';
import CouponsBank from './coupons-bank';

export default class ConnectionSettings
	implements Parsable<ConnectionSettings, ConnectionSettingsData>
{
	private _partner: ConnectionSettings | null;
	private _connection: Connection;
	private _partnerNickname: string;
	private _couponsBank: CouponsBank;
	private _randomCouponPrice: number;

	constructor(connection: Connection, partnerNickname: string) {
		this._partner = null;
		this._connection = connection;
		this._partnerNickname = partnerNickname;
		this._couponsBank = new CouponsBank();
		// TODO: implement default settings
		this._randomCouponPrice = 20;
	}

	get partnerNickname(): string {
		return this._partnerNickname;
	}

	get availableCoupons(): Coupon[] {
		return this._couponsBank.availableCoupons;
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
		if (!this._partner) {
			throw new Error('Connection settings has not been set with a partner');
		}
		return funcToDelegate(this._partner);
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
		return makeGood();
	}

	getConnection(): ResponseMsg<ConnectionData> {
		if (!this._partner) {
			throw new Error('Connection settings has not been set with a partner');
		}
		return makeGood(new ConnectionData(this.parse(), this._partner?.parse()));
	}

	parse(): ConnectionSettingsData {
		return new ConnectionSettingsData(this._randomCouponPrice, this._partnerNickname);
	}

	getData(): ConnectionSettings {
		return this;
	}
}
