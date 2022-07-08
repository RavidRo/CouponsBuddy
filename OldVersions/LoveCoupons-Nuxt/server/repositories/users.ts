import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

export function isUserExists(uid: string) {
	return getAuth()
		.getUser(uid)
		.then(() => true)
		.catch((error) => {
			if (error.code === 'auth/user-not-found') {
				return false;
			}
			throw error;
		});
}

export function getUsersNames(uids: string[]) {
	return getAuth()
		.getUsers(uids.map((uid) => ({ uid })))
		.then((users) => {
			if (users.notFound.length > 0) {
				console.warn('Some of the requested users were not found');
			}
			return users.users.map((user) => user.displayName ?? user.email ?? user.uid);
		});
}
export function getUserName(uid: string) {
	return getAuth()
		.getUser(uid)
		.then((user) => {
			return user.displayName ?? user.email ?? user.uid;
		});
}

async function createUser(userUid: string) {
	const db = getFirestore();
	await db.collection('Users').doc(userUid).set({
		buddies: [],
	});
}

export async function getConnectionsIDs(userUid: string): Promise<string[]> {
	const db = getFirestore();
	const user = (await db.collection('Users').doc(userUid).get()).data();
	if (user) {
		if (Array.isArray(user.buddies)) {
			return user.buddies;
		} else {
			throw new Error('Users.buddies is not an array has expected');
		}
	} else {
		createUser(userUid);
		return [];
	}
}

export async function addBuddy(userUid: string, newConnectionID: string): Promise<void> {
	const db = getFirestore();

	const user = db.collection('Users').doc(userUid);
	await user.update({
		buddies: FieldValue.arrayUnion(newConnectionID),
	});
}

export async function getUserByEmail(email: string) {
	return getAuth()
		.getUserByEmail(email)
		.catch((error) => {
			if (error.code === 'auth/user-not-found') {
				return undefined;
			}
			if (error.code === 'auth/invalid-email') {
				return undefined;
			}
			throw error;
		});
}
