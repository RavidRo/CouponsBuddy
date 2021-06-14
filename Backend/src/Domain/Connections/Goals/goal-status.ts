import { makeFail, makeGood, ResponseMsg } from '../../../response';
import Goal from './goal';

export default abstract class GoalStatus {
	protected goal: Goal;

	constructor(goal: Goal) {
		this.goal = goal;
	}

	protected changeStatus(status: { new (goal: Goal): GoalStatus }): ResponseMsg<null> {
		this.goal.status = new status(this.goal);
		return makeGood();
	}

	abstract complete(): ResponseMsg<null>;
	abstract incomplete(): ResponseMsg<null>;
	abstract approve(): ResponseMsg<null>;
	abstract getStatus(): string;
}

export class InProgress extends GoalStatus {
	getStatus(): string {
		return 'In Progress';
	}
	complete(): ResponseMsg<null> {
		return this.changeStatus(Completed);
	}
	incomplete(): ResponseMsg<null> {
		return makeFail('This goal is already in progress');
	}
	approve(): ResponseMsg<null> {
		return this.changeStatus(Approved);
	}
}

export class Completed extends GoalStatus {
	getStatus(): string {
		return 'Completed';
	}
	complete(): ResponseMsg<null> {
		return makeFail('This goal is already completed');
	}
	incomplete(): ResponseMsg<null> {
		return this.changeStatus(InProgress);
	}
	approve(): ResponseMsg<null> {
		return this.changeStatus(Approved);
	}
}

export class Approved extends GoalStatus {
	getStatus(): string {
		return 'Approved';
	}
	complete(): ResponseMsg<null> {
		return makeFail('This goal is already completed');
	}
	incomplete(): ResponseMsg<null> {
		return makeFail('Approved goals can not be unapproved');
	}
	approve(): ResponseMsg<null> {
		return makeFail('This goal is already approved');
	}
}
