import { ResponseMsg } from '../../response';
import Messaging from '../Messaging/messaging';

export default class Connection {
	private _messaging: Messaging;
	private _chatID: string;

	constructor(uid1: string, uid2: string) {
		this._messaging = new Messaging();
		this._chatID = this._messaging.createChat(uid1, uid2).getData();
	}

	get chatID(): string {
		return this._chatID;
	}

	sendHeart(uid: string): ResponseMsg<null> {
		return this._messaging.sendMessage(uid, this._chatID, '💖');
	}
}
