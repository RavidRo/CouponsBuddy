export default class ExamplesBankData {
	public readonly textPerCategory: { [category: string]: string[] };

	constructor(textPerCategory: { [category: string]: string[] }) {
		this.textPerCategory = textPerCategory;
	}
}
