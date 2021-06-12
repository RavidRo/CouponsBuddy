import Members from '../Domain/Connections/members';
import Rarity from '../Domain/Connections/Coupons/rarity';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';
import CouponData from './DataObjects/coupon-data';
import RarityData from './DataObjects/rarity-data';

export default class CouponsFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = new Members();
	}

	createCoupon(myUID: string, partnerUID: string, content: string): ResponseMsg<string> {
		return this.members.onMember(myUID, (member) => member.createCoupon(partnerUID, content));
	}

	getPartnersAvailable(myUID: string, partnerUID: string): ResponseMsg<CouponData[]> {
		return this.members.onMember(myUID, (member) =>
			member.getPartnersAvailable(partnerUID).parse()
		);
	}

	removeCoupon(myUID: string, partnerUID: string, couponId: string): ResponseMsg<null> {
		return this.members.onMember(myUID, (member) => member.removeCoupon(partnerUID, couponId));
	}

	editCoupon(
		myUID: string,
		partnerUID: string,
		couponID: string,
		newContent: string
	): ResponseMsg<null> {
		return this.members.onMember(myUID, (member) =>
			member.editCoupon(partnerUID, couponID, newContent)
		);
	}

	getRarities(): ResponseMsg<RarityData[]> {
		return Rarity.getRarities();
	}

	setCouponRarity(
		myUID: string,
		partnerUID: string,
		couponID: string,
		rarityName: string
	): ResponseMsg<null> {
		return this.members.onMember(myUID, (member) =>
			member.setCouponRarity(partnerUID, couponID, rarityName)
		);
	}

	setRandomCouponPrice(myUID: string, partnerUID: string, price: number): ResponseMsg<null> {
		return this.members.onMember(myUID, (member) =>
			member.setRandomCouponPrice(partnerUID, price)
		);
	}

	drawCoupon(myUID: string, partnerUID: string): ResponseMsg<CouponData> {
		return this.members.onMember(myUID, (member) => member.drawCoupon(partnerUID));
	}

	getEarnedCoupons(myUID: string, partnerUID: string): ResponseMsg<CouponData[]> {
		return this.members.onMember(myUID, (member) => member.getEarnedCoupon(partnerUID));
	}

	sendCoupon(myUID: string, partnerUID: string, content: string): ResponseMsg<string> {
		return this.members.onMember(myUID, (member) => member.sendCoupon(partnerUID, content));
	}
}
