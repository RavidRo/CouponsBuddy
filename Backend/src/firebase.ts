import admin from 'firebase-admin';
import config from './config';
import Singleton from './singleton';

export class Firebase extends Singleton {
	private _auth: admin.auth.Auth;

	constructor() {
		super();
		admin.initializeApp({
			credential: admin.credential.cert(config.FIREBASE_SERVICE),
			projectId: config.FIREBASE.project_id,
		});
		this._auth = admin.auth();
	}

	static getInstance(): Firebase {
		return this.getInstanceGen(() => new Firebase());
	}

	get auth(): admin.auth.Auth {
		return this._auth;
	}
}
