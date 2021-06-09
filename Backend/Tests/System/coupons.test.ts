import Authentication from '../../src/Service/authentication-facade';
import Partners from '../../src/Service/partners-facade';
import Coupons from '../../src/Service/coupons-facade';

const partners = Partners.getInstance();
const authentication = Authentication.getInstance();
const coupons = Coupons.getInstance();

const register = (() => {
	let uid = 0;
	return () => {
		const member = (uid++).toString();
		const response = authentication.register(member, member);
		if (!response.isSuccess()) {
			throw new Error(response.getError());
		}
		return member;
	};
})();

const connection = () => {
	const uid1 = register();
	const uid2 = register();
	partners.invite(uid1, uid2);
	partners.invite(uid2, uid1);
	return [uid1, uid2];
};

describe('Create coupons', () => {
	test('Create coupon for partner successfully ', () => {
		const [uid1, uid2] = connection();
		const response = coupons.createCoupon(uid1, uid2, 'Breakfast in bed');
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Can not create an empty coupon ', () => {
		const [uid1, uid2] = connection();
		const response = coupons.createCoupon(uid1, uid2, '');
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Created coupons will be added to partners bank ', () => {
		const contents = ['Breakfast in bed', 'Romantic dinner', 'Cuddle time'];
		const [uid1, uid2] = connection();
		contents.forEach((content) => {
			coupons.createCoupon(uid1, uid2, content);
		});

		const response = coupons.getPartnersBank(uid1, uid2);
		const couponsBank = response.getData();

		expect(couponsBank.length).toBe(contents.length);
		expect(couponsBank.map((coupon) => coupon.content)).toEqual(contents);
	});

	test('Created coupons will be added to partners bank only ', () => {
		const [uid1, uid2] = connection();
		coupons.createCoupon(uid1, uid2, 'Breakfast in bed');

		const response = coupons.getPartnersBank(uid2, uid1);
		const couponsBank = response.getData();

		expect(couponsBank.length).toBe(0);
	});

	test('Created coupons will have unique id ', () => {
		const [uid1, uid2] = connection();

		const ids = [];
		for (let i = 0; i < 500; i++) {
			const response = coupons.createCoupon(uid1, uid2, 'Breakfast in bed');
			ids.push(response.getData());
		}
		const uniqueIds = new Set(ids);

		expect(uniqueIds.size).toBe(500);
	});

	test('Returned id is the created coupon id ', () => {
		const [uid1, uid2] = connection();

		const id = coupons.createCoupon(uid1, uid2, 'A lovely coupon').getData();
		const couponsBank = coupons.getPartnersBank(uid1, uid2).getData();

		expect(couponsBank).toHaveLength(1);
		expect(couponsBank[0].id).toEqual(id);
	});
});

describe('Remove coupon', () => {
	test('Remove an existing coupon from partners bank successfully', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.removeCoupon(uid1, uid2, couponId);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Remove none existing partner fails', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.removeCoupon(uid1, uid1, couponId);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Remove an existing coupon from partners bank removes it', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		coupons.removeCoupon(uid1, uid2, couponId);
		const couponsBank = coupons.getPartnersBank(uid1, uid2).getData();

		expect(couponsBank).toHaveLength(0);
	});

	test('Remove a none existing coupon fails', () => {
		const [uid1, uid2] = connection();
		coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.removeCoupon(uid1, uid2, 'random id');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Edit coupon', () => {
	test('Edits an existing coupon in a partners bank successfully', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.editCoupon(uid1, uid2, couponId, 'New content');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Edit a coupons of a none existing partner fails', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.editCoupon(uid1, uid1, couponId, 'New content');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Edit an existing coupon from partners bank edits it', () => {
		const [uid1, uid2] = connection();
		const couponId = coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		coupons.editCoupon(uid1, uid2, couponId, 'New content');
		const couponsBank = coupons.getPartnersBank(uid1, uid2).getData();

		expect(couponsBank[0].content).toBe('New content');
	});

	test('Edit a none existing coupon fails', () => {
		const [uid1, uid2] = connection();
		coupons.createCoupon(uid1, uid2, 'Breakfast in bed').getData();

		const response = coupons.editCoupon(uid1, uid2, 'random id', 'New content');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Can not create an empty coupon ', () => {
		const [uid1, uid2] = connection();
		const id = coupons.createCoupon(uid1, uid2, 'Some content').getData();
		const response = coupons.editCoupon(uid1, uid2, id, '');
		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Set rarity', () => {
	test('Set rarity to a coupon successfully', () => {
		const [uid1, uid2] = connection();
		const id = coupons.createCoupon(uid1, uid2, 'Some content').getData();

		const rarities = coupons.getRarities().getData();
		const response = coupons.setCouponRarity(uid1, uid2, id, rarities[0].name);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Set rarity to a coupon changes rarity successfully', () => {
		const [uid1, uid2] = connection();
		const id = coupons.createCoupon(uid1, uid2, 'Some content').getData();

		const rarities = coupons.getRarities().getData();
		rarities.forEach((rarity) => {
			coupons.setCouponRarity(uid1, uid2, id, rarity.name);
			const coupon = coupons.getPartnersBank(uid1, uid2).getData()[0];
			expect(coupon.rarity).toEqual(rarity);
		});
	});

	test('Set rarity to a none existent one fails', () => {
		const [uid1, uid2] = connection();
		const id = coupons.createCoupon(uid1, uid2, 'Some content').getData();

		const response = coupons.setCouponRarity(uid1, uid2, id, 'random rarity');
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set rarity to a none existent coupon fails', () => {
		const [uid1, uid2] = connection();
		coupons.createCoupon(uid1, uid2, 'Some content').getData();

		const rarities = coupons.getRarities().getData();
		const response = coupons.setCouponRarity(uid1, uid2, 'random coupon', rarities[0].name);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('There is always at least 1 rarity in the system', () => {
		const rarities = coupons.getRarities().getData();
		expect(rarities.length).toBeGreaterThan(0);
	});
});

describe('Set price for your partner random coupon', () => {
	test('Set price successfully', () => {
		const [uid1, uid2] = connection();

		const response = coupons.setRandomCouponPrice(uid1, uid2, 20);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Set price to a negative value fails', () => {
		const [uid1, uid2] = connection();

		const response = coupons.setRandomCouponPrice(uid1, uid2, -20);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set price to 0 successfully', () => {
		const [uid1, uid2] = connection();

		const response = coupons.setRandomCouponPrice(uid1, uid2, 0);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Setting the price successfully will changed the saved price', () => {
		const [uid1, uid2] = connection();

		[2, 5, 20, 17, 8, 45, 102].forEach((price) => {
			coupons.setRandomCouponPrice(uid1, uid2, price);
			const connection = partners.getConnection(uid1, uid2).getData();
			expect(connection.partner.randomCouponPrice).toBe(price);
		});
	});
});
