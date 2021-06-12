export default class ConnectionSettingsData {
	public readonly randomCouponPrice: number;
	public readonly partnerNickname: string;
	public readonly points: number;

	constructor(points: number, randomCouponPrice: number, partnerNickname: string) {
		this.points = points;
		this.randomCouponPrice = randomCouponPrice;
		this.partnerNickname = partnerNickname;
	}
}
