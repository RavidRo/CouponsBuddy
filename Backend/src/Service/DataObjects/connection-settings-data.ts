export default class ConnectionSettingsData {
	public readonly randomCouponPrice: number;
	public readonly partnerNickname: string;

	constructor(randomCouponPrice: number, partnerNickname: string) {
		this.randomCouponPrice = randomCouponPrice;
		this.partnerNickname = partnerNickname;
	}
}
