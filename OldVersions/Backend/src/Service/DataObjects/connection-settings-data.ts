import ActionsData from './actions-data';

export default class ConnectionSettingsData {
	public readonly randomCouponPrice: number;
	public readonly partnerNickname: string;
	public readonly points: number;
	public readonly actions: ActionsData;

	constructor(
		points: number,
		randomCouponPrice: number,
		partnerNickname: string,
		actions: ActionsData
	) {
		this.points = points;
		this.randomCouponPrice = randomCouponPrice;
		this.partnerNickname = partnerNickname;
		this.actions = actions;
	}
}
