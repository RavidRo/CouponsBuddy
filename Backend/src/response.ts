export interface Parsable<T, U> {
	parse(): U;
	getData(): T;
}

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
}
export const makeGood = (): ResponseMsg<null> => {
	return new ResponseSuccess(new PrimitiveParsable(null));
};
export const makeGoodPr = <T>(data: T): ResponseMsg<T> => {
	return new ResponseSuccess(new PrimitiveParsable(data));
};
export const makeGoodPa = <T, U>(data: Parsable<T, U>): ResponseMsg<T, U> => {
	return new ResponseSuccess(data);
};
export const makeGoodArrPa = <T, U>(data: Parsable<T, U>[]): ResponseMsg<T[], U[]> => {
	return new ResponseSuccess(new ArrParsable<T, U>(data));
};
export const makeGoodArrPr = <T>(data: T[]): ResponseMsg<T[]> => {
	return new ResponseSuccess(
		new ArrParsable<T, T>(data.map((curr) => new PrimitiveParsable(curr)))
	);
};
export const makeFail = <T, U>(error: string): ResponseMsg<T, U> => {
	return new ResponseFail(error);
};
