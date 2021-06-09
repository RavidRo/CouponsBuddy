import RarityData from './rarity-data';

export default class CouponData {
	public readonly content: string;
	public readonly id: string;
	public readonly rarity: RarityData;

	constructor(id: string, content: string, rarity: RarityData) {
		this.id = id;
		this.content = content;
		this.rarity = rarity;
	}
}
