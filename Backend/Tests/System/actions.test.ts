import Authentication from '../../src/Service/authentication-facade';
import Partners from '../../src/Service/partners-facade';
import Action from '../../src/Service/actions-facade';
import Messaging from '../../src/Service/messaging-facade';
import MessageData from '../../src/Service/DataObjects/message-data';

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
	const chatID = partners.getConnection(uid1, uid2).getData().chatID;
	return [uid1, uid2, chatID];
};

describe('Disable partners action', () => {
	test('Disable successfully', () => {
		const [uid1, uid2] = connection();

		const response = actions.disableAction(uid1, uid2, 'heart');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Disable action fails when action does not exist', () => {
		const [uid1, uid2] = connection();

		const response = actions.disableAction(uid1, uid2, 'Poo Pi');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disabling successfully make user fail when he tried to perform the action', () => {
		const [uid1, uid2] = connection();

		actions.disableAction(uid1, uid2, 'heart');
		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disable action fails when user does not exist', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, uid2] = connection();

		const response = actions.disableAction('1312', uid2, 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Disable action fails when partner does not exist', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [uid1, _] = connection();

		const response = actions.disableAction(uid1, 'uid2', 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Enable partners action', () => {
	test('Enable successfully', () => {
		const [uid1, uid2] = connection();

		const response = actions.enableAction(uid1, uid2, 'heart');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Enable action fails when action does not exist', () => {
		const [uid1, uid2] = connection();

		const response = actions.enableAction(uid1, uid2, 'Poo Pi');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Enable successfully make user success when he tried to perform the action', () => {
		const [uid1, uid2] = connection();

		actions.disableAction(uid1, uid2, 'heart');
		actions.enableAction(uid1, uid2, 'heart');
		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Enable action fails when user does not exist', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, uid2] = connection();

		const response = actions.enableAction('1312', uid2, 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Enable action fails when partner does not exist', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [uid1, _] = connection();

		const response = actions.enableAction(uid1, 'uid2', 'heart');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Send heart', () => {
	test('Send heart successfully', () => {
		const [uid1, uid2] = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart(uid2, uid1);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending a heart successfully sends the heart at the chat', () => {
		const [uid1, uid2, chatID] = connection();
		actions.enableAction(uid1, uid2, 'heart');

		actions.sendHeart(uid2, uid1);
		const messages = messaging.getMessages(uid1, chatID).getData();

		expect(messages).toContainEqual(new MessageData('💖', uid2));
	});

	test('Sending a heart fails when user does not exist', () => {
		const [uid1, uid2] = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart('uid2', uid1);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending a heart fails when partner does not exist', () => {
		const [uid1, uid2] = connection();
		actions.enableAction(uid1, uid2, 'heart');

		const response = actions.sendHeart(uid2, 'uid1');

		expect(response.isSuccess()).toBeFalsy();
	});
});
