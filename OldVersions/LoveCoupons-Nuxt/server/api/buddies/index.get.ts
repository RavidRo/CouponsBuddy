import { getBuddies } from '~~/server/repositories/buddies';
import { sendUnauthorized } from '~/server/utils';

export default defineEventHandler(async (event) => {
	if (!event.context.auth) {
		return sendUnauthorized(event);
	}

	return getBuddies(event.context.auth.uid);
});
