import { Authentication } from '../Domain/Authentication/authentication';
import Members from '../Domain/Connections/members';
import { ResponseMsg } from '../response';
import Singleton from '../singleton';

export default class AuthenticationFacade extends Singleton {
	private members: Members;
	private auth: Authentication;

	constructor() {
		super();
		this.members = new Members();
		this.auth = new Authentication();
	}

	register(uid: string, nickname: string): ResponseMsg<void> {
		return this.members.register(uid, nickname);
	}

	authenticate(authToken: string): Promise<ResponseMsg<string>> {
		return this.auth.authenticate(authToken);
	}
}
