import { sendError } from 'h3';

import { isConnected, createConnection } from '~~/server/repositories/buddies';
import { getUserByEmail, getUserName } from '~~/server/repositories/users';
import { isMissingArgument, sendUnauthorized } from '~/server/utils';
import { isString } from '@vue/shared';

export default defineEventHandler(async (event) => {
	const user = event.context.auth;
	if (!user) {
		return sendUnauthorized(event);
	}

	const body = await useBody(event);
	const error = isMissingArgument(body, 'emailToInvite');
	if (error) {
		return sendError(event, error);
	}

	const toInviteEmail: any = body['emailToInvite'];
	if (!isString(toInviteEmail)) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'emailToInvite must be a string',
			})
		);
	}

	const toInviteId = (await getUserByEmail(toInviteEmail))?.uid;

	if (!toInviteId) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Requested user does not exist',
			})
		);
	}

	if (toInviteId === user.uid) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: "You can't invite yourself ",
			})
		);
	}

	if (await isConnected(toInviteId, user.uid)) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Requested user is already your buddy',
			})
		);
	}

	const userNamePromise = getUserName(toInviteId);
	const chatID = await createConnection(user.uid, toInviteId);
	const buddy: Buddy = { name: await userNamePromise, chat: chatID };
	return buddy;
});
