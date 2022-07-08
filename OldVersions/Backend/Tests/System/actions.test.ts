import Authentication from '../../src/Service/authentication-facade';
import Partners from '../../src/Service/partners-facade';
import Action from '../../src/Service/actions-facade';
import Messaging from '../../src/Service/messaging-facade';
import MessageData from '../../src/Service/DataObjects/message-data';
import settings from '../../settings';

const partners = new Partners();
const authentication = new Authentication();
const actions = new Action();
const messaging = new Messaging();

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
	const connection = partners.getConnection(uid1, uid2).getData();
	return { uid1, uid2, ...connection };
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Disable partners action', () => {
	test('Disable successfully', () => {
		const { uid1, uid2 } = connection();

		const response = actions.disableAction(uid1, uid2, 'heart');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Disable action fails when action does not exist', () => {
		const { uid1, uid2 } = connection();

		const response = actions.disableAction(uid1, uid2, 'Poo Pi');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disabling successfully make user fail when he tried to perform the action', () => {
		const { uid1, uid2 } = connection();

		actions.disableAction(uid1, uid2, 'heart');
		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disable action fails when user does not exist', () => {
		const { uid2 } = connection();

		const response = actions.disableAction('1312', uid2, 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disable action fails when partner does not exist', () => {
		const { uid1 } = connection();

		const response = actions.disableAction(uid1, 'uid2', 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Enable partners action', () => {
	test('Enable successfully', () => {
		const { uid1, uid2 } = connection();

		const response = actions.enableAction(uid1, uid2, 'heart');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Enable action fails when action does not exist', () => {
		const { uid1, uid2 } = connection();

		const response = actions.enableAction(uid1, uid2, 'Poo Pi');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Enable successfully make user success when he tried to perform the action', () => {
		const { uid1, uid2 } = connection();

		actions.disableAction(uid1, uid2, 'heart');
		actions.enableAction(uid1, uid2, 'heart');
		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Enable action fails when user does not exist', () => {
		const { uid2 } = connection();

		const response = actions.enableAction('1312', uid2, 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Enable action fails when partner does not exist', () => {
		const { uid1 } = connection();

		const response = actions.enableAction(uid1, 'uid2', 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send heart', () => {
	test('Send heart successfully', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a heart successfully sends the heart at the chat', () => {
		const { uid1, uid2, chatID } = connection();
		actions.enableAction(uid1, uid2, 'heart');

		actions.sendHeart(uid2, uid1);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData('💖', uid2));
	});

	test('Sending a heart successfully adds its reward', () => {
		const { uid1, uid2, partner } = connection();
		actions.enableAction(uid1, uid2, 'heart');
		actions.sendHeart(uid2, uid1);

		const currentPoints = partners.getConnection(uid2, uid1).getData().me.points;

		expect(partner.points + partner.actions.metaData['heart'].reward).toBe(currentPoints);
	});

	test('Sending a heart fails when user does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart('uid2', uid1);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a heart fails when partner does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart(uid2, 'uid1');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send message', () => {
	const content = 'A cute message';
	test('Send message successfully', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'message');

		const response = actions.sendMessage(uid2, uid1, content);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a message successfully sends the heart at the chat', () => {
		const { uid1, uid2, chatID } = connection();
		actions.enableAction(uid1, uid2, 'message');

		actions.sendMessage(uid2, uid1, content);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData(content, uid2));
	});

	test('Sending a message successfully adds its reward', () => {
		const { uid1, uid2, partner } = connection();
		actions.enableAction(uid1, uid2, 'message');
		actions.sendMessage(uid2, uid1, content);

		const currentPoints = partners.getConnection(uid2, uid1).getData().me.points;

		expect(partner.points + partner.actions.metaData['message'].reward).toBe(currentPoints);
	});

	test('Sending a message fails when user does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'message');

		const response = actions.sendMessage('uid2', uid1, content);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a message fails when partner does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'message');

		const response = actions.sendMessage(uid2, 'uid1', content);

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send picture', () => {
	const pictureURI = 'fkon092nufi23nskqw90d';
	test('Send picture successfully', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'picture');

		const response = actions.sendPicture(uid2, uid1, pictureURI);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a picture successfully sends the heart at the chat', () => {
		const { uid1, uid2, chatID } = connection();
		actions.enableAction(uid1, uid2, 'picture');

		actions.sendPicture(uid2, uid1, pictureURI);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData('', uid2, pictureURI));
	});

	test('Sending a picture successfully adds its reward', () => {
		const { uid1, uid2, partner } = connection();
		actions.enableAction(uid1, uid2, 'picture');
		actions.sendPicture(uid2, uid1, pictureURI);

		const currentPoints = partners.getConnection(uid2, uid1).getData().me.points;

		expect(partner.points + partner.actions.metaData['picture'].reward).toBe(currentPoints);
	});

	test('Sending a picture fails when user does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'picture');

		const response = actions.sendPicture('uid2', uid1, pictureURI);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a picture fails when partner does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'picture');

		const response = actions.sendPicture(uid2, 'uid1', pictureURI);

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send video', () => {
	const videoURI = 'fkon092nufi23nskqw90d';
	test('Send video successfully', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'video');

		const response = actions.sendVideo(uid2, uid1, videoURI);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a video successfully sends the heart at the chat', () => {
		const { uid1, uid2, chatID } = connection();
		actions.enableAction(uid1, uid2, 'video');

		actions.sendVideo(uid2, uid1, videoURI);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData('', uid2, videoURI));
	});

	test('Sending a video successfully adds its reward', () => {
		const { uid1, uid2, partner } = connection();
		actions.enableAction(uid1, uid2, 'video');
		actions.sendVideo(uid2, uid1, videoURI);

		const currentPoints = partners.getConnection(uid2, uid1).getData().me.points;

		expect(partner.points + partner.actions.metaData['video'].reward).toBe(currentPoints);
	});

	test('Sending a video fails when user does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'video');

		const response = actions.sendVideo('uid2', uid1, videoURI);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a video fails when partner does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'video');

		const response = actions.sendVideo(uid2, 'uid1', videoURI);

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send coupon', () => {
	const content = 'You brand new coupon!';
	test('Send coupon successfully', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'coupon');

		const response = actions.sendCoupon(uid2, uid1, content);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a coupon successfully sends the heart at the chat', () => {
		const { uid1, uid2, chatID } = connection();
		actions.enableAction(uid1, uid2, 'coupon');

		actions.sendCoupon(uid2, uid1, content);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData(content, uid2));
	});

	test('Sending a coupon successfully adds its reward', () => {
		const { uid1, uid2, partner } = connection();
		actions.enableAction(uid1, uid2, 'coupon');
		actions.sendCoupon(uid2, uid1, content);

		const currentPoints = partners.getConnection(uid2, uid1).getData().me.points;

		expect(partner.points + partner.actions.metaData['coupon'].reward).toBe(currentPoints);
	});

	test('Sending a coupon fails when user does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'coupon');

		const response = actions.sendCoupon('uid2', uid1, content);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a coupon fails when partner does not exist', () => {
		const { uid1, uid2 } = connection();
		actions.enableAction(uid1, uid2, 'coupon');

		const response = actions.sendCoupon(uid2, 'uid1', content);

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Set the reward of an action', () => {
	test('Set reward successfully', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setReward(uid1, uid2, 'heart', 50);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Set reward failed when user does not exists', () => {
		const { uid2 } = connection();

		const response = actions.setReward('uid1', uid2, 'heart', 50);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set reward failed when partner does not exists', () => {
		const { uid1 } = connection();

		const response = actions.setReward(uid1, 'uid2', 'heart', 50);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set reward failed when action does not exists', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setReward(uid1, uid2, 'heart Kooli Booli', 50);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set reward failed when reward is not negative', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setReward(uid1, uid2, 'heart', -50);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set reward failed when reward is not an integer', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setReward(uid1, uid2, 'heart', 5.123);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Setting a reward successfully actually changes the action reward', () => {
		const { uid1, uid2 } = connection();

		actions.setReward(uid1, uid2, 'heart', 23);
		const pointsPrev = partners.getConnection(uid2, uid1).getData().me.points;
		actions.sendHeart(uid2, uid1);
		const pointsAfter = partners.getConnection(uid2, uid1).getData().me.points;

		expect(pointsPrev + 23).toBe(pointsAfter);
	});
});

describe('Timer tests', () => {
	test('Actions are available when timer is not ready', () => {
		const { uid1, uid2 } = connection();

		actions.sendHeart(uid1, uid2);
		const response = actions.sendHeart(uid1, uid2);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('The user will not get a reward when timer is not ready', () => {
		const { uid1, uid2 } = connection();

		actions.sendHeart(uid1, uid2);
		const pointsPrev = partners.getConnection(uid1, uid2).getData().me.points;
		actions.sendHeart(uid1, uid2);
		const pointsAfter = partners.getConnection(uid1, uid2).getData().me.points;

		expect(pointsPrev).toBe(pointsAfter);
	});

	test('Timer will be ready again after a certain time', async () => {
		const { uid1, uid2 } = connection();

		actions.sendHeart(uid1, uid2);
		await sleep(settings.defaults.timer);
		const pointsPrev = partners.getConnection(uid1, uid2).getData().me.points;
		actions.sendHeart(uid1, uid2);
		const pointsAfter = partners.getConnection(uid1, uid2).getData().me.points;

		expect(pointsPrev).toBeLessThan(pointsAfter);
	});
});

describe('Set timer for partner', () => {
	test('Set partner timer successfully', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setPartnerTimer(uid1, uid2, 2);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Set partner timer successfully changes the timer', () => {
		const { uid1, uid2 } = connection();

		actions.setPartnerTimer(uid1, uid2, 23);
		const { timer } = partners.getConnection(uid1, uid2).getData().partner.actions;

		expect(timer).toBe(23);
	});

	test('Set partner timer fails when negative timer is given', () => {
		const { uid1, uid2 } = connection();

		const response = actions.setPartnerTimer(uid1, uid2, -2);

		expect(response.isSuccess()).toBeFalsy();
	});
});
