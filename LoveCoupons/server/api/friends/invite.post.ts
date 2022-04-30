import { getFirestore } from 'firebase-admin/firestore';
import { sendError } from 'h3';

export default defineEventHandler(async (event) => {
	if (!event.context.auth) {
		return sendError(
			event,
			createError({
				statusCode: 403,
				statusMessage: "Missing a valid authentication token in request's headers",
			})
		);
	}

	const body = await useBody(event);
	if (!('userid' in body)) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Missing userid in body',
			})
		);
	}

	const toInviteId: string = body['userid'];

	const db = getFirestore();
	const newDoc = await db
		.collection('Connections')
		.add({ user1: event.context.auth.uid, user2: toInviteId });

	return newDoc.id;
});
