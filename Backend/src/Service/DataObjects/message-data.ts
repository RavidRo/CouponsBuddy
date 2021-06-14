export default class MessageData {
	public readonly content: string;
	public readonly senderID: string;

	constructor(content: string, senderID: string) {
		this.content = content;
		this.senderID = senderID;
	}
}
