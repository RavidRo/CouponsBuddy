import { ResponseMsg } from '../../response';
import Connection from './connection';
import Coupon from './Coupon';
import CouponsBank from './coupons-bank';

export default class ConnectionSettings {
	private _partner: ConnectionSettings | null;
	private _connection: Connection;
	private _partnerNickname: string;
	private _couponsBank: CouponsBank;

	constructor(connection: Connection, partnerNickname: string) {
		this._partner = null;
		this._connection = connection;
		this._partnerNickname = partnerNickname;
		this._couponsBank = new CouponsBank();
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
}
