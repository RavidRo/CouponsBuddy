import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, browserLocalPersistence } from 'firebase/auth';
import Cookies from 'js-cookie';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	// Initialize Firebase
	const app = initializeApp(config.public.firebaseConfig);
	const analytics = getAnalytics(app);
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
			// localStorage.setItem('user', JSON.stringify(user.toJSON()));
			// Cookies.set('auth-token', await user.getIdToken());
		} else {
			userState.value = 'loggedOut';
			// Cookies.remove('auth-token');
		}
	});

	return {
		provide: {
			auth,
		},
	};
});
