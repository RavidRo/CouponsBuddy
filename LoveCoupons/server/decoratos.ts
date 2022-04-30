function authenticate() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		console.log('first(): called');
	};
}
