import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';
import CouponData from './DataObjects/coupon-data';

export default class CouponsFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = Members.getInstance();
	}

	static getInstance(): CouponsFacade {
		return this.getInstanceGen(() => new CouponsFacade());
	}

	createCoupon(myUID: string, partnerUID: string, content: string): ResponseMsg<string> {
		return this.members.createCoupon(myUID, partnerUID, content);
	}

	getPartnersBank(myUID: string, partnerUID: string): ResponseMsg<CouponData[]> {
		return this.members.getPartnersBank(myUID, partnerUID);
	}

	removeCoupon(myUID: string, partnerUID: string, couponId: string): ResponseMsg<null> {
		return this.members.removeCoupon(myUID, partnerUID, couponId);
	}
}
