import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { initializeFirestore } from 'firebase/firestore';

export default defineEventHandler((event) => {
	const apps = getApps();

	if (!apps.length) {
		const config = useRuntimeConfig();

		initializeApp({
			credential: cert({
				clientEmail: process.env.CLIENT_EMAIL,
				privateKey: process.env.PRIVATE_KEY,
				projectId: config.public.firebaseConfig.projectId,
			}),
		});
	}
});
