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
	async authenticate(authToken: string): Promise<ResponseMsg<string>> {
		try {
			const idToken = await this.firebase.auth.verifyIdToken(authToken);
			return makeGood(idToken.uid);
		} catch (error) {
			return makeFail(error);
		}
	}

	async getUserByPhoneNumber(phoneNumber: string): Promise<ResponseMsg<string>> {
		try {
			const userRecord = await this.firebase.auth.getUserByPhoneNumber(phoneNumber);
			return makeGood(userRecord.uid);
		} catch (error) {
			return makeFail(error);
		}
	}
}
