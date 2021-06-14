import { v4 as uuid } from 'uuid';
import { makeFail, makeGood, Parsable, ResponseMsg } from '../../response';
import MessageData from '../../Service/DataObjects/message-data';
import Singleton from '../../singleton';

class Message implements Parsable<Message, MessageData> {
	private _content: string;
	private _senderID: string;

	constructor(content: string, senderID: string) {
		this._content = content;
		this._senderID = senderID;
	}
	parse(): MessageData {
		return new MessageData(this._content, this._senderID);
	}
	getData(): Message {
		return this;
	}
}

class Chat {
	private _id: string;
	private _messages: Message[];

	constructor() {
		this._id = uuid();
		this._messages = [];
	}

	get id(): string {
		return this._id;
	}

	get messages(): Message[] {
		return this._messages;
	}

	sendMessage(content: string, senderID: string): ResponseMsg<null> {
		this._messages.push(new Message(content, senderID));
		return makeGood();
	}
}

class ChatState {
	private _chat: Chat;

	constructor(chat: Chat) {
		this._chat = chat;
	}

	get messages(): Message[] {
		return this._chat.messages;
	}

	sendMessage(content: string, senderID: string): ResponseMsg<null> {
		return this._chat.sendMessage(content, senderID);
	}
}

class Sender {
	private _chats: { [chatId: string]: ChatState };

	constructor() {
		this._chats = {};
	}

	setChat(chat: Chat): void {
		this._chats[chat.id] = new ChatState(chat);
	}

	getMessages(chatID: string): ResponseMsg<Message[], MessageData[]> {
		if (!(chatID in this._chats)) {
			return makeFail('You do not have any chats with the given id');
		}
		return makeGood<Message, MessageData>(this._chats[chatID].messages);
	}

	sendMessage(chatID: string, content: string, senderID: string): ResponseMsg<null> {
		if (!(chatID in this._chats)) {
			return makeFail('You do not have any chats with the given id');
		}
		return this._chats[chatID].sendMessage(content, senderID);
	}
}

export default class Messaging extends Singleton {
	private _senders: { [senderId: string]: Sender };

	constructor() {
		super();
		this._senders = {};
	}

	private loadSender(senderID: string): void {
		if (!(senderID in this._senders)) {
			this._senders[senderID] = new Sender();
		}
	}

	createChat(sender1: string, sender2: string): ResponseMsg<string> {
		this.loadSender(sender1);
		this.loadSender(sender2);

		const chat = new Chat();
		this._senders[sender1].setChat(chat);
		this._senders[sender2].setChat(chat);

		return makeGood(chat.id);
	}

	getMessages(myID: string, chatID: string): ResponseMsg<MessageData[]> {
		this.loadSender(myID);
		return this._senders[myID].getMessages(chatID).parse();
	}

	sendMessage(uid: string, chatID: string, content: string): ResponseMsg<null> {
		this.loadSender(uid);
		return this._senders[uid].sendMessage(chatID, content, uid);
	}
}
