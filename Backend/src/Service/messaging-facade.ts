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
}
