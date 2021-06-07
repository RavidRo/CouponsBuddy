export default class ResponseMsg<T> {
	protected _data?: T;
	protected _errorMsg?: string;
	protected _success: boolean;

	constructor(success: true, data?: T);
	constructor(success: boolean, data?: T, errorMsg?: string);
	constructor(success: boolean, data?: T, errorMsg?: string) {
		this._success = success;
		this._data = data;
		this._errorMsg = errorMsg;
	}

	static makeError<T>(errorMsg: string): ResponseMsg<T> {
		return new ResponseMsg<T>(false, undefined, errorMsg);
	}
	static makeSuccess<T>(data?: T): ResponseMsg<T> {
		return new ResponseMsg<T>(true, data);
	}

	get success(): boolean {
		return this._success;
	}
	get data(): T | undefined {
		return this._data;
	}
	get errorMsg(): string {
		return this._success ? 'Success!' : this._errorMsg || '';
	}
}

export interface Parsable<U> {
	parse(): U;
}

export class ParsableResponse<U, T extends Parsable<U>> extends ResponseMsg<T> {
	static makeParsError<U, T extends Parsable<U>>(errorMsg: string): ParsableResponse<U, T> {
		return new ParsableResponse<U, T>(false, undefined, errorMsg);
	}

	static makeParsSuccess<U, T extends Parsable<U>>(data?: T): ParsableResponse<U, T> {
		return new ParsableResponse<U, T>(true, data);
	}

	parse(): ResponseMsg<U> {
		if (!this.success) {
			return ResponseMsg.makeError(this.errorMsg);
		}
		return new ResponseMsg(this.success, this.data?.parse(), this.errorMsg);
	}
}

export class ParsableArrResponse<U, T extends Parsable<U>> extends ResponseMsg<T[]> {
	static makeParsArrError<U, T extends Parsable<U>>(errorMsg: string): ParsableArrResponse<U, T> {
		return new ParsableArrResponse<U, T>(false, undefined, errorMsg);
	}
	static makeParsArrSuccess<U, T extends Parsable<U>>(data?: T[]): ParsableArrResponse<U, T> {
		return new ParsableArrResponse<U, T>(true, data);
	}

	parse(): ResponseMsg<U[]> {
		if (!this.success) {
			return ResponseMsg.makeError(this.errorMsg);
		}
		return new ResponseMsg(
			this._success,
			this.data?.map((value) => value.parse()),
			this._errorMsg
		);
	}
}
