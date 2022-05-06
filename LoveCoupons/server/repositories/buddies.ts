import { FieldPath, getFirestore } from 'firebase-admin/firestore';
import { getConnectionsIDs as getConnectionsIDs, getUsersNames } from './users';

export async function createConnection(user1Uid: string, user2UID: string) {
	const db = getFirestore();
	const newDoc = await db.collection('Buddies').add({ user1: user1Uid, user2: user2UID });

	return newDoc.id;
}

export async function getBuddiesNames(userUid: string) {
	return getConnectionsIDs(userUid).then(async (connectionsIDs) => {
		const db = getFirestore();

		if (connectionsIDs.length === 0) {
			return [];
		}
		const connections = await db
			.collection('Buddies')
			.where(FieldPath.documentId(), 'in', connectionsIDs)
			.get();

		if (connections.size !== connectionsIDs.length) {
			console.warn('Could not find all the requested connections');
		}

		const buddiesIDs = connections.docs.map((doc) => {
			const connection = doc.data();
			const user1Uid = connection.user1.id;
			const user2Uid = connection.user2.id;
			return user1Uid === userUid ? user2Uid : user1Uid;
		});

		return getUsersNames(buddiesIDs);
	});
}
