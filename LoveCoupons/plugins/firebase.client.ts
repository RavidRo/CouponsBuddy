import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, browserLocalPersistence } from 'firebase/auth';
import Cookies from 'js-cookie';

export default defineNuxtPlugin(() => {
	const firebaseConfig = {
		apiKey: 'AIzaSyAjWFfRYca04z0dTHVyP5p-vNfxY4xfk8g',
		authDomain: 'love-coupons-9177b.firebaseapp.com',
		projectId: 'love-coupons-9177b',
		storageBucket: 'love-coupons-9177b.appspot.com',
		messagingSenderId: '283128359821',
		appId: '1:283128359821:web:6a5630edb6583828222bc4',
		measurementId: 'G-ED6BR3VS18',
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth(app);
	auth.useDeviceLanguage();
	// auth.setPersistence();
	auth.setPersistence(browserLocalPersistence);
	// connectAuthEmulator(auth, 'http://localhost:9099');
	onAuthStateChanged(auth, async (user) => {
		if (user !== null) {
			console.log('Logged in', user.toJSON());
			// localStorage.setItem('user', JSON.stringify(user.toJSON()));
			// Cookies.set('auth-token', await user.getIdToken());
		} else {
			// Cookies.remove('auth-token');
		}
	});

	return {
		provide: {
			auth,
		},
	};
});
