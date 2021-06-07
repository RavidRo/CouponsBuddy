// import admin from 'firebase-admin';
import { Firebase } from '../../firebase';
import { makeFail, makeGoodPr, ResponseMsg } from '../../response';
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
			.then((idToken) => makeGoodPr(idToken.uid))
			.catch((error) => makeFail(error));
	}

	getUserByPhoneNumber(phoneNumber: string): Promise<ResponseMsg<string>> {
		return this.firebase.auth
			.getUserByPhoneNumber(phoneNumber)
			.then((userRecord) => makeGoodPr(userRecord.uid))
			.catch((error) => makeFail(error));
	}
}
