import Authentication from '../../src/Service/authentication-facade';
import InvitationData from '../../src/Service/DataObjects/invitation-data';
import PartnerData from '../../src/Service/DataObjects/partner-data';
import Partners from '../../src/Service/partners-facade';

const partners = Partners.getInstance();
const authentication = Authentication.getInstance();

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

describe('invitation', () => {
	test('simple invite succeeds ', () => {
		const uid1 = register();
		const uid2 = register();
		const response = partners.invite(uid1, uid2);
		if (!response.isSuccess()) {
			console.log(response.getError());
		}
		expect(response.isSuccess()).toBeTruthy();
	});
	test('Successful invitation added to invitations list ', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.getData()).toContainEqual(new InvitationData(uid1, uid1));
	});
	test('Successful invitation is not added to inviter invitations list ', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.getData()).not.toContainEqual(new InvitationData(uid2, uid2));
	});
	test('Can invite twice successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.invite(uid1, uid2);
		expect(response.isSuccess()).toBeTruthy();
	});
	test('Second invitation does not get added', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.getData().length).toBe(1);
		expect(response.getData()).toContainEqual(new InvitationData(uid1, uid1));
	});

	test('Accept invitation existing invitation successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.isSuccess()).toBeTruthy();
	});
	test('Can not accept invitation with no invitation', () => {
		const uid1 = register();
		const uid2 = register();
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.isSuccess()).toBeFalsy();
	});
	test('Can not accept twice', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.isSuccess()).toBeFalsy();
	});
	test('Can not invite after getting accepted', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.invite(uid1, uid2);
		expect(response.isSuccess()).toBeFalsy();
	});
	test('Can not invite after accepting', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.invite(uid2, uid1);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Accepting an invitation creates a connection', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response1 = partners.getPartners(uid1);
		const response2 = partners.getPartners(uid2);
		expect(response1.getData()).toContainEqual(new PartnerData(uid2, uid2));
		expect(response2.getData()).toContainEqual(new PartnerData(uid1, uid1));
	});
	test('Accepting an invitation removes it', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.getInvitations(uid2);
		expect(response.getData().length).toBe(0);
	});
	test('Rejecting an invitation removes it', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response = partners.getInvitations(uid2);
		expect(response.getData().length).toBe(0);
	});
	test('Rejecting an invitation does not create a connection', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response1 = partners.getPartners(uid1);
		const response2 = partners.getPartners(uid2);
		expect(response1.getData().length).toBe(0);
		expect(response2.getData().length).toBe(0);
	});
	test('Can invite again after getting rejected', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response = partners.invite(uid1, uid2);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Inviting after getting invited accepts invitation', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const responseInvitation = partners.invite(uid2, uid1);
		const responseInvitations1 = partners.getInvitations(uid1);
		const responseInvitations2 = partners.getInvitations(uid1);
		const responsePartners1 = partners.getPartners(uid1);
		const responsePartners2 = partners.getPartners(uid2);

		expect(responseInvitation.isSuccess()).toBeTruthy();
		expect(responseInvitations1.getData().length).toBe(0);
		expect(responseInvitations2.getData().length).toBe(0);
		expect(responsePartners1.getData()).toContainEqual(new PartnerData(uid2, uid2));
		expect(responsePartners2.getData()).toContainEqual(new PartnerData(uid1, uid1));
	});

	test('Deleting existing connection successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.leavePartner(uid1, uid2);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Deleting existing connection removes partner', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		partners.leavePartner(uid1, uid2);
		const response = partners.getPartners(uid1);
		expect(response.getData().length).toBe(0);
	});

	test('Deleting existing connection removes me from partner', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		partners.leavePartner(uid1, uid2);
		const response = partners.getPartners(uid2);
		expect(response.getData().length).toBe(0);
	});

	test('Deleting none existing connection fails', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);

		const response = partners.leavePartner(uid1, uid2);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Deleting none existing user fails', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.leavePartner(uid1, 'random');
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Both partners start with 0 points', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const connection = partners.getConnection(uid1, uid2).getData();
		expect(connection.me.points).toBe(0);
		expect(connection.partner.points).toBe(0);
	});
});

describe('Sending points to a partner', () => {
	test('Sending points successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.sendPoints(uid1, uid2, 20);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Sending negative points fail', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.sendPoints(uid1, uid2, -124);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending 0 points fail', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.sendPoints(uid1, uid2, 0);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending none full number of points fail', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const response = partners.sendPoints(uid1, uid2, 4.7);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Sending points successfully will add points to your partner', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid2, uid1);

		const points = [1, 20, 5, 7, 14, 2, 104];
		points.forEach((point) => {
			partners.sendPoints(uid1, uid2, point);
		});
		const connection = partners.getConnection(uid1, uid2).getData();
		expect(connection.partner.points).toBe(points.reduce((prev, curr) => curr + prev));
	});
});
