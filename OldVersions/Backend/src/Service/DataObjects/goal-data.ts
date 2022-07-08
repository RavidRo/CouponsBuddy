export default class GoalData {
	public readonly goal: string;
	public readonly reward: number;
	public readonly id: string;
	public readonly status: string;

	constructor(id: string, goal: string, reward: number, status: string) {
		this.goal = goal;
		this.reward = reward;
		this.id = id;
		this.status = status;
	}
}
