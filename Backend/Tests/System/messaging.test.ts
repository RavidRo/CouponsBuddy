import Authentication from '../../src/Service/authentication-facade';
import Partners from '../../src/Service/partners-facade';
import Messaging from '../../src/Service/messaging-facade';
import MessageData from '../../src/Service/DataObjects/message-data';

const partners = new Partners();
const authentication = new Authentication();
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

describe('Send message', () => {
	test('Send message successfully', () => {
		const { uid1, chatID } = connection();

		const response = messaging.sendMessage(uid1, chatID, 'Hola my love 💖');

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Send message successfully sends the message to partner', () => {
		const { uid1, uid2, chatID } = connection();

		messaging.sendMessage(uid1, chatID, 'Hola my love 💖', '1234');
		const messages = messaging.getMessages(uid2, chatID).getData();

		expect(messages.filter((message) => message.senderID === uid1)).toContainEqual(
			new MessageData('Hola my love 💖', uid1, '1234')
		);
	});

	test('Send message fails when message is empty without file', () => {
		const { uid1, chatID } = connection();

		const response = messaging.sendMessage(uid1, chatID, '');

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Send message succeed when message is empty with file', () => {
		const { uid1, chatID } = connection();

		const response = messaging.sendMessage(uid1, chatID, '', 'dj819j');

		expect(response.isSuccess()).toBeTruthy();
	});
});
