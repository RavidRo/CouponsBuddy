import { makeGood, Parsable, ResponseMsg } from '../../response';
import RarityData from '../../Service/DataObjects/rarity-data';
import rarities, { isRarityName } from './rarities-data';

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

	parse(): RarityData {
		return new RarityData(this._name, this._probability, this._color);
	}
	getData(): Rarity {
		return this;
	}

	static getRarityByName(name: string): Rarity | undefined {
		const rarity = this._instances[name];
		if (rarity) return rarity;

		if (!isRarityName(name)) return undefined;
		const newRarity = rarities[name];
		return new Rarity(name, newRarity.probability, newRarity.color);
	}

	static getRarities(): ResponseMsg<RarityData[]> {
		for (const [rarityName, rarity] of Object.entries(rarities)) {
			if (!this._instances[rarityName]) {
				new Rarity(rarityName, rarity.probability, rarity.color);
			}
		}
		return makeGood<Rarity, RarityData>(Object.values(this._instances)).parse();
	}

	static getDefault(): Rarity {
		if (!this._default) {
			for (const [rarityName, rarity] of Object.entries(rarities)) {
				if (rarity.default) {
					this._default = new Rarity(rarityName, rarity.probability, rarity.color);
				}
			}
		}

		if (!this._default) {
			throw new Error('At least 1 rarity should be configured as default');
		}

		return this._default;
	}
}
