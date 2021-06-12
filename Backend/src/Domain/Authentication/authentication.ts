// import admin from 'firebase-admin';
import { Firebase } from '../../firebase';
import { makeFail, makeGood, ResponseMsg } from '../../response';
import Singleton from '../../singleton';

export class Authentication extends Singleton {
	private firebase: Firebase;

	constructor() {
		super();
		this.firebase = new Firebase();
	}

	// Authenticates the given token and returns the user uid
	authenticate(authToken: string): Promise<ResponseMsg<string>> {
		return this.firebase.auth
			.verifyIdToken(authToken)
			.then((idToken) => makeGood(idToken.uid))
			.catch((error) => makeFail(error));
	}

	getUserByPhoneNumber(phoneNumber: string): Promise<ResponseMsg<string>> {
		return this.firebase.auth
			.getUserByPhoneNumber(phoneNumber)
			.then((userRecord) => makeGood(userRecord.uid))
			.catch((error) => makeFail(error));
	}
}
