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

	sendHeart(senderUID: string): ResponseMsg<void> {
		return this._messaging.sendMessage(senderUID, this._chatID, '💖');
	}

	sendMessage(senderUID: string, content: string): ResponseMsg<void> {
		return this._messaging.sendMessage(senderUID, this._chatID, content);
	}

	sendPicture(senderUID: string, pictureURI: string): ResponseMsg<void> {
		return this._messaging.sendMessage(senderUID, this._chatID, '', pictureURI);
	}

	sendVideo(senderUID: string, videoURI: string): ResponseMsg<void> {
		return this._messaging.sendMessage(senderUID, this._chatID, '', videoURI);
	}

	sendCoupon(senderUID: string, content: string): ResponseMsg<void> {
		return this._messaging.sendMessage(senderUID, this._chatID, content);
	}
}
