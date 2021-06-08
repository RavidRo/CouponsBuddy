import Singleton from '../../singleton';
import ExampleBank from './example-bank';
import { TextPerCategory } from './examples-data';

export default class Examples extends Singleton {
	private _coupons_examples_bank: ExampleBank;
	constructor() {
		super();
		this._coupons_examples_bank = new ExampleBank('coupons');
	}

	static getInstance(): Examples {
		return this.getInstanceGen(() => new Examples());
	}

	get CouponsExample(): TextPerCategory {
		return this._coupons_examples_bank.examples;
	}
}
