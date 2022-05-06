import { getBuddiesNames } from '~~/server/repositories/buddies';
import { sendUnauthorized } from '~/server/utils';

export default defineEventHandler(async (event) => {
	if (!event.context.auth) {
		return sendUnauthorized(event);
	}

	return getBuddiesNames(event.context.auth.uid);
});
