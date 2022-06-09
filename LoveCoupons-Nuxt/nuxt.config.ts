import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	typescript: {
		shim: false,
		strict: true,
		// typeCheck: true,
	},
	css: ['~/assets/css/main.css'],
	runtimeConfig: {
		public: {
			firebaseConfig: {
				apiKey: 'AIzaSyAjWFfRYca04z0dTHVyP5p-vNfxY4xfk8g',
				authDomain: 'love-coupons-9177b.firebaseapp.com',
				projectId: 'love-coupons-9177b',
				storageBucket: 'love-coupons-9177b.appspot.com',
				messagingSenderId: '283128359821',
				appId: '1:283128359821:web:6a5630edb6583828222bc4',
				measurementId: 'G-ED6BR3VS18',
			},
		},
	},
});
