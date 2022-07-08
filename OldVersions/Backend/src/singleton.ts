export default class Singleton {
	protected static instances: { [className: string]: Singleton } = {};

	protected constructor() {
		if (Singleton.instances[this.constructor.name]) {
			return Singleton.instances[this.constructor.name];
		}
		Singleton.instances[this.constructor.name] = this;
	}
}
