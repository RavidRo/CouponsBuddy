import settings from '../../../../settings';
import { makeGood, Parsable, ResponseMsg } from '../../../response';
import RarityData from '../../../Service/DataObjects/rarity-data';
import rarities, { isRarityName } from '../Data/rarities-data';

export default class Rarity implements Parsable<Rarity, RarityData> {
	private _name: string;
	private _probability: number;
	private _color: string;

	private static _instances: { [name: string]: Rarity } = {};
	private static _default: Rarity;

	constructor(name: string, probability: number, color: string) {
		this._name = name;
		this._probability = probability;
		this._color = color;
		Rarity._instances[name] = this;
	}

	get name(): string {
		return this._name;
	}

	parse(): RarityData {
		return new RarityData(this._name, this._probability, this._color);
	}
	getData(): Rarity {
		return this;
	}

	static loadRarities(): void {
		for (const [rarityName, rarity] of Object.entries(rarities)) {
			if (!this._instances[rarityName]) {
				new Rarity(rarityName, rarity.probability, rarity.color);
			}
		}
	}

	static getRarityByName(name: string): Rarity | undefined {
		const rarity = this._instances[name];
		if (rarity) return rarity;

		if (!isRarityName(name)) return undefined;
		const newRarity = rarities[name];
		return new Rarity(name, newRarity.probability, newRarity.color);
	}

	static getDefault(): Rarity {
		if (!this._default) {
			const defaultName = settings.defaults.defaultCoupon;
			const rarity = this.getRarityByName(defaultName);
			if (!rarity) {
				throw new Error('Default coupon rarity does not exists in rarities');
			}
			this._default = rarity;
		}
		return this._default;
	}

	static getRarities(): ResponseMsg<RarityData[]> {
		this.loadRarities();
		return makeGood<Rarity, RarityData>(Object.values(this._instances)).parse();
	}

	static getRandomRarityName(raritiesNames: string[]): string {
		this.loadRarities();
		const rarities = raritiesNames.map((rarityName) => {
			if (!(rarityName in this._instances)) {
				throw new Error('Get random rarity got none existing rarity');
			}
			return this._instances[rarityName];
		});
		const sumOfProbabilities = rarities.reduce((prev, curr) => prev + curr._probability, 0);
		let random = Math.random() * sumOfProbabilities;
		for (const rarity of rarities) {
			if (random <= rarity._probability) return rarity._name;
			random -= rarity._probability;
		}
		throw new Error('Some calculations gone wrong, does not suppose to get here');
	}
}
