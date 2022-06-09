// import { getAuth, verf } from 'firebase/auth';
import { sendError } from 'h3';

export default defineEventHandler((event) => {
	if (!event.context.auth) {
		return sendError(
			event,
			createError({
				statusCode: 403,
				statusMessage: "Missing a valid authentication token in request's headers",
			})
		);
	}

	console.log(event.context.auth);
	return 'Works!';
});
