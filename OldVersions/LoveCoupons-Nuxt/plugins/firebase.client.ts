import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

import { getAuth, onAuthStateChanged, browserLocalPersistence } from 'firebase/auth';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	// Initialize Firebase
	const app = initializeApp(config.public.firebaseConfig);
	const analytics = getAnalytics(app);
	const firestore = getFirestore(app);

	const auth = getAuth(app);
	auth.useDeviceLanguage();
	// auth.setPersistence();
	auth.setPersistence(browserLocalPersistence);
	console.log('User state is unknown');
	// connectAuthEmulator(auth, 'http://localhost:9099');
	const userState = useLoggedState();
	onAuthStateChanged(auth, (user) => {
		if (user !== null) {
			console.log('Logged in', user.toJSON());
			userState.value = 'loggedIn';
		} else {
			userState.value = 'loggedOut';
		}
	});

	return {
		provide: {
			auth,
		},
	};
});
