import { Parsable } from '../../response';
import InvitationData from '../../Service/DataObjects/invitation-data';
import Connection from './connection';
import ConnectionSettings from './connection-settings';
import Member from './member';

export default class Invitation implements Parsable<Invitation, InvitationData> {
	private readonly _toUID: string;
	private readonly _sender: Member;

	constructor(toUID: string, sender: Member) {
		this._toUID = toUID;
		this._sender = sender;
	}

	accept(myNickname: string): ConnectionSettings {
		const newConnection = new Connection();
		const mySettings = new ConnectionSettings(newConnection, this._sender.nickname);
		const partnerSettings = new ConnectionSettings(newConnection, myNickname);
		mySettings.setPartner(partnerSettings);
		partnerSettings.setPartner(mySettings);
		this._sender.addConnection(this._toUID, partnerSettings);
		return mySettings;
	}

	parse(): InvitationData {
		return new InvitationData(this._sender.uid, this._sender.nickname);
	}

	getData(): Invitation {
		return this;
	}
}
