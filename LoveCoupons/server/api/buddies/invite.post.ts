import { sendError } from 'h3';

import { createConnection } from '~~/server/repositories/buddies';
import { getUserName, isUserExists } from '~~/server/repositories/users';
import { isMissingArgument, sendUnauthorized } from '~/server/utils';

export default defineEventHandler(async (event) => {
	if (!event.context.auth) {
		return sendUnauthorized(event);
	}

	const body = await useBody(event);
	const error = isMissingArgument(body, 'userid');
	if (error) {
		return sendError(event, error);
	}
	const toInviteId: string = body['userid'];

	if (await isUserExists(toInviteId)) {
		const userNamePromise = getUserName(toInviteId);
		await createConnection(event.context.auth.uid, toInviteId);
		return await userNamePromise;
	} else {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'Requested user does not exist',
			})
		);
	}
});
