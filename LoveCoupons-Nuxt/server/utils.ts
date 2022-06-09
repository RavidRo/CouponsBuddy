import { sendError, createError, CompatibilityEvent, useBody, H3Error } from 'h3';

export function sendUnauthorized(event: CompatibilityEvent) {
	return sendError(
		event,
		createError({
			statusCode: 401,
			statusMessage: "Missing a valid authentication token in request's headers",
		})
	);
}

export function isMissingArgument(body: any, ...args: string[]): H3Error | undefined {
	for (const arg of args) {
		if (!(arg in body)) {
			return createError({
				statusCode: 400,
				statusMessage: `Missing ${arg} in request's body`,
			});
		}
	}
	return undefined;
}
