import settings from '../../../settings';
import { makeFail, makeGood, Parsable, ResponseMsg } from '../../response';
import ActionsData, { ActionMeta } from '../../Service/DataObjects/actions-data';

enum Action {
	heart = 'heart',
	message = 'message',
	video = 'video',
	picture = 'picture',
	coupon = 'coupon',
}

export default class Actions implements Parsable<Actions, ActionsData> {
	private _actionsMeta: Record<Action, ActionMeta>;
	private _timer: number;
	private _lastAction: number;

	constructor() {
		this._actionsMeta = settings.defaults.actions;
		this._timer = settings.defaults.timer;
		this._lastAction = 0;
	}

	private isActionName(actionName: string): actionName is keyof typeof Action {
		return actionName in Action;
	}

	private validateAction(actionName: string): ResponseMsg<ActionMeta> {
		if (!this.isActionName(actionName)) {
			return makeFail(`${actionName} is not a valid action`);
		}
		return makeGood(this._actionsMeta[actionName]);
	}

	private isAvailable(actionName: keyof typeof Action): ResponseMsg<void> {
		const meta = this._actionsMeta[actionName];
		if (meta.disabled) {
			return makeFail(
				'This action is disabled for you. You can ask you partner for permission.'
			);
		}
		return makeGood();
	}

	private timerReady(): boolean {
		const current = new Date().getTime();
		const lastAction = this._lastAction;
		return current - lastAction > this._timer;
	}

	private act(actionName: keyof typeof Action): ResponseMsg<number> {
		return this.isAvailable(actionName).then(() => {
			if (!this.timerReady()) {
				return 0;
			}
			this._lastAction = new Date().getTime();
			return this._actionsMeta[actionName].reward;
		});
	}

	parse(): ActionsData {
		return { timer: this._timer, lastAction: this._lastAction, metaData: this._actionsMeta };
	}
	getData(): Actions {
		return this;
	}

	disableAction(actionName: string): ResponseMsg<void> {
		return this.validateAction(actionName).then((action) => {
			action.disabled = true;
		});
	}

	enableAction(actionName: string): ResponseMsg<void> {
		return this.validateAction(actionName).then((action) => {
			action.disabled = false;
		});
	}

	sendHeart(): ResponseMsg<number> {
		return this.act('heart');
	}

	sendMessage(): ResponseMsg<number> {
		return this.act('message');
	}

	sendPicture(): ResponseMsg<number> {
		return this.act('picture');
	}

	sendVideo(): ResponseMsg<number> {
		return this.act('video');
	}

	sendCoupon(): ResponseMsg<number> {
		return this.act('coupon');
	}

	setReward(actionName: string, reward: number): ResponseMsg<void> {
		return this.validateAction(actionName).then((action) => {
			if (reward < 0 || !Number.isInteger(reward)) {
				return makeFail('Reward must be a positive integer');
			}
			action.reward = reward;
		});
	}

	setTimer(newTimer: number): ResponseMsg<void> {
		if (newTimer < 0) {
			return makeFail('Timer must be a positive number');
		}
		this._timer = newTimer;
		return makeGood();
	}
}
