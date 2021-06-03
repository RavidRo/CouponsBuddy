import Members from '../Domain/Connections/members';
import ResponseMsg from '../response';
import Singleton from '../singleton';

export default class AuthenticationFacade extends Singleton {
	private members: Members;

	constructor() {
		super();
		this.members = Members.getInstance();
	}

	static getInstance(): AuthenticationFacade {
		return this.getInstanceGen(() => new AuthenticationFacade());
	}

	register(uid: string, nickname: string): ResponseMsg<never> {
		return this.members.register(uid, nickname);
	}
}
