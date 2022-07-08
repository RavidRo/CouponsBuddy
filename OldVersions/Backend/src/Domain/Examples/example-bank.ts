import { Parsable } from '../../response';
import ExamplesBankData from '../../Service/DataObjects/examples-bank-data';
import data, { Data, TextPerCategory } from './examples-data';

export default class ExampleBank implements Parsable<ExampleBank, ExamplesBankData> {
	private _textPerCategory: { [category: string]: string[] };

	constructor(subject: keyof Data) {
		if (!(subject in data)) {
			throw new Error(`examples-data file is missing required subject ${subject}`);
		}
		this._textPerCategory = data[subject];
	}

	get examples(): TextPerCategory {
		return this._textPerCategory;
	}

	parse(): ExamplesBankData {
		return new ExamplesBankData(this._textPerCategory);
	}

	getData(): ExampleBank {
		return this;
	}
}
