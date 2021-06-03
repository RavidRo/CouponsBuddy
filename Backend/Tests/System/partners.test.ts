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
		if (!response.success) {
			throw new Error(response.errorMsg);
		}
		return member;
	};
})();

describe('invitation', () => {
	test('simple invite succeeds ', () => {
		const uid1 = register();
		const uid2 = register();
		const response = partners.invite(uid1, uid2);
		if (!response.success) {
			console.log(response.errorMsg);
		}
		expect(response.success).toBeTruthy();
	});
	test('Successful invitation added to invitations list ', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.data).toContainEqual(new InvitationData(uid1, uid1));
	});
	test('Successful invitation is not added to inviter invitations list ', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.data).not.toContainEqual(new InvitationData(uid2, uid2));
	});
	test('Can invite twice successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.invite(uid1, uid2);
		expect(response.success).toBeTruthy();
	});
	test('Second invitation does not get added', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.invite(uid1, uid2);
		const response = partners.getInvitations(uid2);
		expect(response.data?.length).toBe(1);
		expect(response.data).toContainEqual(new InvitationData(uid1, uid1));
	});

	test('Accept invitation existing invitation successfully', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.success).toBeTruthy();
	});
	test('Can not accept invitation with no invitation', () => {
		const uid1 = register();
		const uid2 = register();
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.success).toBeFalsy();
	});
	test('Can not accept twice', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.acceptInvitation(uid2, uid1);
		expect(response.success).toBeFalsy();
	});
	test('Can not invite after getting accepted', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.invite(uid1, uid2);
		expect(response.success).toBeFalsy();
	});
	test('Can not invite after accepting', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.invite(uid2, uid1);
		expect(response.success).toBeFalsy();
	});

	test('Accepting an invitation creates a connection', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response1 = partners.getPartners(uid1);
		const response2 = partners.getPartners(uid2);
		expect(response1?.data).toContainEqual(new PartnerData(uid2, uid2));
		expect(response2?.data).toContainEqual(new PartnerData(uid1, uid1));
	});
	test('Accepting an invitation removes it', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.acceptInvitation(uid2, uid1);
		const response = partners.getInvitations(uid2);
		expect(response.data?.length).toBe(0);
	});
	test('Rejecting an invitation removes it', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response = partners.getInvitations(uid2);
		expect(response.data?.length).toBe(0);
	});
	test('Rejecting an invitation does not create a connection', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response1 = partners.getPartners(uid1);
		const response2 = partners.getPartners(uid2);
		expect(response1.data?.length).toBe(0);
		expect(response2.data?.length).toBe(0);
	});
	test('Can invite again after getting rejected', () => {
		const uid1 = register();
		const uid2 = register();
		partners.invite(uid1, uid2);
		partners.rejectInvitation(uid2, uid1);
		const response = partners.invite(uid1, uid2);
		expect(response.success).toBeTruthy();
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

		expect(responseInvitation.success).toBeTruthy();
		expect(responseInvitations1.data?.length).toBe(0);
		expect(responseInvitations2.data?.length).toBe(0);
		expect(responsePartners1.data).toContainEqual(new PartnerData(uid2, uid2));
		expect(responsePartners2.data).toContainEqual(new PartnerData(uid1, uid1));
	});
});
