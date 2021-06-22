export default class MessageData {
	public readonly content: string;
	public readonly senderID: string;
	public readonly attachedFile?: string;

	constructor(content: string, senderID: string, attachedFile?: string) {
		this.content = content;
		this.senderID = senderID;
		this.attachedFile = attachedFile;
	}
}
