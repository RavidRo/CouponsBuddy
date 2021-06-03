export default class InvitationData {
	public readonly fromNickname: string;
	public readonly fromUID: string;

	constructor(fromUID: string, fromNickname: string) {
		this.fromNickname = fromNickname;
		this.fromUID = fromUID;
	}
}
