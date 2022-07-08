import config from './src/config';

const settingsProduction = {
	defaults: {
		timer: 14400000, //In millie seconds
		randomCouponPrice: 20,
		defaultCoupon: 'common',
		actions: {
			heart: {
				reward: 5,
				disabled: false,
			},
			message: {
				reward: 10,
				disabled: false,
			},
			picture: {
				reward: 15,
				disabled: false,
			},
			video: {
				reward: 20,
				disabled: false,
			},
			coupon: {
				reward: 25,
				disabled: false,
			},
		},
	},
};

const settingsTesting = {
	defaults: {
		timer: 100, //In millie seconds
		randomCouponPrice: 20,
		defaultCoupon: 'common',
		actions: {
			heart: {
				reward: 5,
				disabled: false,
			},
			message: {
				reward: 10,
				disabled: false,
			},
			picture: {
				reward: 15,
				disabled: false,
			},
			video: {
				reward: 20,
				disabled: false,
			},
			coupon: {
				reward: 25,
				disabled: false,
			},
		},
	},
};

export default config.TESTING ? settingsTesting : settingsProduction;
