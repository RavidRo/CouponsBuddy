import { isString } from '@vue/shared';
import { FieldPath, getFirestore } from 'firebase-admin/firestore';
import { addBuddy, getConnectionsIDs as getConnectionsIDs, getUsersNames } from './users';

const collectionName = 'Connections';

export async function createConnection(user1Uid: string, user2Uid: string) {
	const db = getFirestore();
	const newDoc = await db
		.collection(collectionName)
		.add({ user1: { id: user1Uid, coupons: [] }, user2: { id: user2Uid, coupons: [] } });
	const newConnectionID = newDoc.id;

	// TODO: Move to Cloud Functions
	const update1Promise = addBuddy(user1Uid, newConnectionID);
	const update2Promise = addBuddy(user2Uid, newConnectionID);
	await Promise.all([update1Promise, update2Promise]);

	return newDoc.id;
}

export async function isConnected(user1Uid: string, user2Uid: string): Promise<boolean> {
	const db = getFirestore();

	const isConnectionExists = async (user1: string, user2: string) =>
		db
			.collection(collectionName)
			.where('user1.id', '==', user1)
			.where('user2.id', '==', user2)
			.get()
			.then((connections) => !connections.empty);

	const exists1Promise = isConnectionExists(user1Uid, user2Uid);
	const exists2Promise = isConnectionExists(user2Uid, user1Uid);

	return (await exists1Promise) || (await exists2Promise);
}

export async function getBuddiesNames(userUid: string) {
	return getConnectionsIDs(userUid).then(async (connectionsIDs) => {
		const db = getFirestore();

		if (connectionsIDs.length === 0) {
			return [];
		}
		const connections = await db
			.collection(collectionName)
			.where(FieldPath.documentId(), 'in', connectionsIDs)
			.get();

		if (connections.size !== connectionsIDs.length) {
			console.warn('Could not find all the requested connections');
		}

		const buddiesIDs = connections.docs.map((doc) => {
			const connection = doc.data();
			const user1Uid = connection.user1.id;
			const user2Uid = connection.user2.id;

			if (!isString(user1Uid) || !isString(user2Uid)) {
				throw new Error('Connection document does not have the expected structure');
			}

			return user1Uid === userUid ? user2Uid : user1Uid;
		});

		return getUsersNames(buddiesIDs);
	});
}
