import settings from '../../../settings';
import { makeFail, makeGood, ResponseMsg } from '../../response';

enum Action {
	heart = 'heart',
	message = 'message',
	video = 'video',
	picture = 'picture',
	coupon = 'coupon',
}

type ActionMeta = {
	points: number;
	disabled: boolean;
};

export default class Actions {
	private _actionsMeta: Record<Action, ActionMeta>;

	constructor() {
		this._actionsMeta = settings.defaults.actions;
	}

	private isActionName(actionName: string): actionName is keyof typeof Action {
		return actionName in Action;
	}

	disableAction(actionName: string): ResponseMsg<void> {
		if (!this.isActionName(actionName)) {
			return makeFail(`${actionName} is not a valid action`);
		}
		this._actionsMeta[actionName].disabled = true;
		return makeGood();
	}

	enableAction(actionName: string): ResponseMsg<void> {
		if (!this.isActionName(actionName)) {
			return makeFail(`${actionName} is not a valid action`);
		}
		this._actionsMeta[actionName].disabled = false;
		return makeGood();
	}

	sendHeart(): ResponseMsg<number> {
		if (this._actionsMeta.heart.disabled) {
			return makeFail(
				'The heart action is disabled for you. You can ask you partner for permission.'
			);
		}
		return makeGood(this._actionsMeta.heart.points);
	}
}
