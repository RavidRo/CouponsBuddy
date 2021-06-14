import { makeFail, makeGood, ResponseMsg } from '../../../response';
import Goal from './goal';

export default abstract class GoalStatus {
	protected goal: Goal;

	constructor(goal: Goal) {
		this.goal = goal;
	}

	protected changeStatus(status: { new (goal: Goal): GoalStatus }): ResponseMsg<void> {
		this.goal.status = new status(this.goal);
		return makeGood();
	}

	abstract complete(): ResponseMsg<void>;
	abstract incomplete(): ResponseMsg<void>;
	abstract approve(): ResponseMsg<void>;
	abstract getStatus(): string;
}

export class InProgress extends GoalStatus {
	getStatus(): string {
		return 'In Progress';
	}
	complete(): ResponseMsg<void> {
		return this.changeStatus(Completed);
	}
	incomplete(): ResponseMsg<void> {
		return makeFail('This goal is already in progress');
	}
	approve(): ResponseMsg<void> {
		return this.changeStatus(Approved);
	}
}

export class Completed extends GoalStatus {
	getStatus(): string {
		return 'Completed';
	}
	complete(): ResponseMsg<void> {
		return makeFail('This goal is already completed');
	}
	incomplete(): ResponseMsg<void> {
		return this.changeStatus(InProgress);
	}
	approve(): ResponseMsg<void> {
		return this.changeStatus(Approved);
	}
}

export class Approved extends GoalStatus {
	getStatus(): string {
		return 'Approved';
	}
	complete(): ResponseMsg<void> {
		return makeFail('This goal is already completed');
	}
	incomplete(): ResponseMsg<void> {
		return makeFail('Approved goals can not be unapproved');
	}
	approve(): ResponseMsg<void> {
		return makeFail('This goal is already approved');
	}
}
