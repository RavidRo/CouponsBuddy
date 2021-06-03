export default class Singleton {
	protected static instances: { [className: string]: Singleton } = {};

	protected constructor() {
		if (Singleton.instances[this.constructor.name]) {
			throw new Error('Can not initiate more than one singleton');
		}
	}

	protected static getInstanceGen<T extends Singleton>(make: () => T): T {
		if (!this.instances[this.name]) {
			this.instances[this.name] = make();
		}
		return this.instances[this.name] as T;
	}
}
