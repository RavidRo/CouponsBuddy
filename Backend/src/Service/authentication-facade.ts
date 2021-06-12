import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';

export default class AuthenticationFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = new Members();
	}

	register(uid: string, nickname: string): ResponseMsg<null> {
		return this.members.register(uid, nickname);
	}
}
