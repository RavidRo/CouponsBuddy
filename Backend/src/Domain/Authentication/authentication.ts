// import admin from 'firebase-admin';
import { Firebase } from '../../firebase';
import ResponseMsg from '../../response';
import Singleton from '../../singleton';

export class Authentication extends Singleton {
	private firebase: Firebase;

	constructor() {
		super();
		this.firebase = Firebase.getInstance();
	}

	static getInstance(): Authentication {
		return this.getInstanceGen(() => new Authentication());
	}

	// Authenticates the given token and returns the user uid
	authenticate(authToken: string): Promise<ResponseMsg<string>> {
		return this.firebase.auth
			.verifyIdToken(authToken)
			.then((idToken) => ResponseMsg.makeSuccess(idToken.uid))
			.catch((error) => ResponseMsg.makeError(error));
	}

	getUserByPhoneNumber(phoneNumber: string): Promise<ResponseMsg<string>> {
		return this.firebase.auth
			.getUserByPhoneNumber(phoneNumber)
			.then((userRecord) => ResponseMsg.makeSuccess(userRecord.uid))
			.catch((error) => ResponseMsg.makeError(error));
	}
}
