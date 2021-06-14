export interface Parsable<T, U> {
	parse(): U;
	getData(): T;
}

const isParsable = <T, U>(object: unknown): object is Parsable<T, U> => {
	return (object as Parsable<T, U>).parse !== undefined;
};
const isParsableArr = <T, U>(arr: unknown[]): arr is Parsable<T, U>[] => {
	return arr.length === 0 || isParsable(arr[0]);
};

class PrimitiveParsable<T> implements Parsable<T, T> {
	private _data: T;

	constructor(data: T) {
		this._data = data;
	}
	parse(): T {
		return this._data;
	}
	getData(): T {
		return this._data;
	}
}

class ArrParsable<V, U> implements Parsable<V[], U[]> {
	private _data: Parsable<V, U>[];

	constructor(data: Parsable<V, U>[]) {
		this._data = data;
	}
	parse(): U[] {
		return this._data.map((curr) => curr.parse());
	}
	getData(): V[] {
		return this._data.map((curr) => curr.getData());
	}
}

export interface ResponseMsg<T, U = T> extends Parsable<T, ResponseMsg<U>> {
	isSuccess(): boolean;
	getError(): string;
	getData(): T;
	then<V>(func: (data: T) => V): ResponseMsg<V>;
}

class ResponseSuccess<T, U = T> implements ResponseMsg<T, U> {
	private _data: Parsable<T, U>;

	constructor(data: Parsable<T, U>) {
		this._data = data;
	}

	isSuccess(): boolean {
		return true;
	}

	getError(): string {
		return 'No error';
	}
	getData(): T {
		return this._data.getData();
	}

	parse(): ResponseMsg<U> {
		const parsable = new PrimitiveParsable(this._data.parse());
		const response = new ResponseSuccess<U>(parsable);
		return response;
	}

	then<V>(func: (data: T) => V): ResponseMsg<V> {
		return makeGood(func(this._data.getData()));
	}
}

class ResponseFail<T, U> implements ResponseMsg<T, U> {
	private _error: string;

	constructor(error: string) {
		this._error = error;
	}

	isSuccess(): boolean {
		return false;
	}
	getError(): string {
		return this._error;
	}
	getData(): T {
		throw new Error('Failed response does not have data');
	}
	parse(): ResponseMsg<U> {
		return new ResponseFail(this._error);
	}

	then<V>(_: (data: T) => V): ResponseMsg<V> {
		return makeFail(this._error);
	}
}

function makeGoodArr<T, U>(data: T[] | Parsable<T, U>[]): ResponseMsg<T[]> | ResponseMsg<T[], U[]> {
	if (isParsableArr(data)) {
		return new ResponseSuccess(new ArrParsable<T, U>(data));
	}
	return new ResponseSuccess(
		new ArrParsable<T, T>(data.map((curr) => new PrimitiveParsable(curr)))
	);
}
function makeGoodData<T, U>(data: T | Parsable<T, U>): ResponseMsg<T> | ResponseMsg<T, U> {
	if (isParsable(data)) {
		return new ResponseSuccess(data);
	}
	return new ResponseSuccess(new PrimitiveParsable(data));
}

export function makeGood(): ResponseMsg<null>;
export function makeGood<T>(data: T): ResponseMsg<T>;
export function makeGood<T, U>(data: Parsable<T, U>): ResponseMsg<T, U>;
export function makeGood<T>(data: T[]): ResponseMsg<T[]>;
export function makeGood<T, U>(data: Parsable<T, U>[]): ResponseMsg<T[], U[]>;
export function makeGood<T, U>(
	data?: T | Parsable<T, U> | T[] | Parsable<T, U>[]
):
	| ResponseMsg<null>
	| ResponseMsg<T>
	| ResponseMsg<T, U>
	| ResponseMsg<T[]>
	| ResponseMsg<T[], U[]> {
	if (data === undefined) {
		return new ResponseSuccess(new PrimitiveParsable(null));
	}
	if (Array.isArray(data)) {
		return makeGoodArr(data);
	}
	return makeGoodData(data);
}

export const makeFail = <T, U>(error: string): ResponseMsg<T, U> => {
	return new ResponseFail(error);
};
