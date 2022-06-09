import { getAuth } from 'firebase-admin/auth';

export default defineEventHandler(async (event) => {
	const authToken = event.req.headers.authorization;
	if (authToken) {
		await getAuth()
			.verifyIdToken(authToken)
			.then((decodedToken) => (event.context.auth = decodedToken))
			.catch((error) => console.warn(error));
	}
});
