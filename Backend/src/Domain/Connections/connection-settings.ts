import Connection from './connection';

export default class ConnectionSettings {
	private _partner: ConnectionSettings | null;
	private _connection: Connection;
	private _partnerNickname: string;

	constructor(connection: Connection, partnerNickname: string) {
		this._partner = null;
		this._connection = connection;
		this._partnerNickname = partnerNickname;
	}

	get partnerNickname(): string {
		return this._partnerNickname;
	}

	setPartner(partner: ConnectionSettings): void {
		if (this._partner) {
			throw new Error('Can not change partners in connection settings');
		}
		this._partner = partner;
	}
}
