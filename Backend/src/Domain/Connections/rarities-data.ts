const rarities: Rarities = {
	legendry: {
		probability: 0.05,
		color: '#F1F1C9',
		default: false,
	},
	common: {
		probability: 0.3,
		color: '#B1B1B1',
		default: true,
	},
};
export default rarities;

export function isRarityName(name: string): name is keyof Rarities {
	return name in rarities;
}
export type RarityType = {
	probability: number;
	color: string;
	default: boolean;
};
export type Rarities = {
	legendry: RarityType;
	common: RarityType;
};
