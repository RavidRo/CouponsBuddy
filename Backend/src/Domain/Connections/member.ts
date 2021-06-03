import ResponseMsg from '../../response';
import PartnerData from '../../Service/DataObjects/partner-data';
import ConnectionSettings from './connection-settings';
import Invitation from './invitation';

export default class Member {
	private _invitations: { [senderUID: string]: Invitation };
	private _uid: string;
	private _nickname: string;
	private connections: { [partnerUID: string]: ConnectionSettings };

	constructor(uid: string, nickname: string) {
		this._uid = uid;
		this._invitations = {};
		this._nickname = nickname;
		this.connections = {};
	}

	get uid(): string {
		return this._uid;
	}
	get nickname(): string {
		return this._nickname;
	}

	get invitations(): Invitation[] {
		return Object.values(this._invitations);
	}

	invite(sender: Member): ResponseMsg<never> {
		if (this.connections[sender.uid]) {
			return ResponseMsg.makeError('You are already partners');
		}
		if (!this._invitations[sender.uid]) {
			const invitation = new Invitation(this._uid, sender);
			this._invitations[sender.uid] = invitation;
		}
		return ResponseMsg.makeSuccess();
	}

	acceptInvitation(inviterUID: string): ResponseMsg<never> {
		if (!this._invitations[inviterUID]) {
			return ResponseMsg.makeError('Has no invitation from the given user');
		}

		const mySettings = this._invitations[inviterUID].accept(this.nickname);
		this.connections[inviterUID] = mySettings;

		return this.removeInvitation(inviterUID);
	}

	addConnection(partnerUID: string, connection: ConnectionSettings): void {
		if (this.connections[partnerUID]) {
			throw new Error('Can not redeclare connections');
		}
		this.connections[partnerUID] = connection;
	}

	getPartners(): PartnerData[] {
		const partners = Object.keys(this.connections).map((partnerUID) => {
			return new PartnerData(partnerUID, this.connections[partnerUID].partnerNickname);
		});
		return partners;
	}

	rejectInvitation(toRejectUID: string): ResponseMsg<never> {
		if (!this._invitations[toRejectUID]) {
			return ResponseMsg.makeError('Has no invitation from the given user');
		}

		return this.removeInvitation(toRejectUID);
	}

	hasInvitation(fromUID: string): boolean {
		return this._invitations[fromUID] !== undefined;
	}

	private removeInvitation(uid: string): ResponseMsg<never> {
		delete this._invitations[uid];
		return ResponseMsg.makeSuccess();
	}
}
