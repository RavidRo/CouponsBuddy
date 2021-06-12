import Authentication from '../../src/Service/authentication-facade';
import Partners from '../../src/Service/partners-facade';
import Goals from '../../src/Service/goals-facade';
import GoalData from '../../src/Service/DataObjects/goal-data';

const partners = new Partners();
const authentication = new Authentication();
const goals = new Goals();

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

describe('Create goals', () => {
	test('Create a goal successfully', () => {
		const [uid1, uid2] = connection();

		const response = goals.addGoalToPartner(uid1, uid2, 'Take me for an ice cream date', 20);
		expect(response.isSuccess()).toBeTruthy();
	});

	test('Creating a goal successfully adds it to partners goals', () => {
		const [uid1, uid2] = connection();

		const id = goals
			.addGoalToPartner(uid1, uid2, 'Take me for an ice cream date', 20)
			.getData();
		const myGoals = goals.getMyGoals(uid2, uid1).getData();
		expect(myGoals).toContainEqual(new GoalData('Take me for an ice cream date', 20, id));
	});

	test('Creating a goal fails if goal is an empty string', () => {
		const [uid1, uid2] = connection();

		const response = goals.addGoalToPartner(uid1, uid2, '', 20);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Creating a goal fails if points is a negative value', () => {
		const [uid1, uid2] = connection();

		const response = goals.addGoalToPartner(uid1, uid2, 'Some goal', -1);
		expect(response.isSuccess()).toBeFalsy();
	});

	test('Creating a goal fails if points is not a full number', () => {
		const [uid1, uid2] = connection();

		const response = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15.4);
		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Delete goal', () => {
	test('Delete goal successfully', () => {
		const [uid1, uid2] = connection();

		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();
		const response = goals.removeGoal(uid1, uid2, id);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Delete goal removes goal from partners goals', () => {
		const [uid1, uid2] = connection();

		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();
		goals.removeGoal(uid1, uid2, id);
		const myGoals = goals.getMyGoals(uid2, uid1).getData();

		expect(myGoals).toHaveLength(0);
	});

	test('Delete goal fails when user id does not exists', () => {
		const [uid1, uid2] = connection();

		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();
		const response = goals.removeGoal('12312', uid2, id);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Delete goal fails when user does not have connection with given partner', () => {
		const [uid1, uid2] = connection();

		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();
		const response = goals.removeGoal(uid1, '123', id);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Delete goal fails when user does not have goal with given id', () => {
		const [uid1, uid2] = connection();

		goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();
		const response = goals.removeGoal(uid1, uid2, 'dsa');

		expect(response.isSuccess()).toBeFalsy();
	});
});

describe('Set goals rewards', () => {
	test('Set goal reward successfully', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward(uid1, uid2, id, 25);

		expect(response.isSuccess()).toBeTruthy();
	});

	test('Set goal reward successfully changed the goal reward', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		goals.setGoalReward(uid1, uid2, id, 25);
		const myGoals = goals.getMyGoals(uid2, uid1).getData();

		expect(myGoals).toContainEqual(new GoalData('Some goal', 25, id));
	});

	test('Set goal reward fails when user does not exist', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward('dsadsa', uid2, id, 25);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set goal reward fails when partner does not exist', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward(uid1, 'dasdsa', id, 25);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set goal reward fails when goal does not exist', () => {
		const [uid1, uid2] = connection();
		goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward(uid1, uid2, 'Dasds', 25);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set goal reward fails when reward is negative', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward(uid1, uid2, id, -25);

		expect(response.isSuccess()).toBeFalsy();
	});

	test('Set goal reward fails when fails when reward is not an integer', () => {
		const [uid1, uid2] = connection();
		const id = goals.addGoalToPartner(uid1, uid2, 'Some goal', 15).getData();

		const response = goals.setGoalReward(uid1, uid2, id, 25.45);

		expect(response.isSuccess()).toBeFalsy();
	});
});
