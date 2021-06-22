import Messaging from '../Domain/Messaging/messaging';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';
import MessageData from './DataObjects/message-data';

export default class MessagingFacade extends Singleton {
	private messaging: Messaging;

	constructor() {
		super();
		this.messaging = new Messaging();
	}

	getMessages(myID: string, chatID: string): ResponseMsg<MessageData[]> {
		return this.messaging.getMessages(myID, chatID);
	}

	sendMessage(
		myID: string,
		chatID: string,
		content: string,
		attachedFileURI?: string
	): ResponseMsg<void> {
		return this.messaging.sendMessage(myID, chatID, content, attachedFileURI);
	}
}
