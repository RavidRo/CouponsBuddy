export default class GoalData {
	public readonly goal: string;
	public readonly reward: number;
	public readonly id: string;

	constructor(goal: string, reward: number, id: string) {
		this.goal = goal;
		this.reward = reward;
		this.id = id;
	}
}
