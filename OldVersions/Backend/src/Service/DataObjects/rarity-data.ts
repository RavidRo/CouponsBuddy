export default class RarityData {
	public readonly name: string;
	public readonly popularity: number;
	public readonly color: string;

	constructor(name: string, popularity: number, color: string) {
		this.name = name;
		this.popularity = popularity;
		this.color = color;
	}
}
