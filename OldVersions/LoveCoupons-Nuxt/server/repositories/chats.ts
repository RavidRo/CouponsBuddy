import { getFirestore } from 'firebase-admin/firestore';

const collectionName = 'Chats';

export async function createChat() {
	const db = getFirestore();
	const newDoc = await db.collection(collectionName).add({ messages: [] });
	return newDoc.id;
}
