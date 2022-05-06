let initiated = false;
const useBuddies = () => {
	const pending = useState<boolean>('buddies-pending', () => true);
	const buddies = useState<Buddy[]>('buddies', () => []);
	const error = useState<boolean>('buddies-error', () => false);

	const refresh = () => {
		pending.value = true;
		error.value = false;
		useGet<Buddy[]>('api/buddies')
			.then((initialBuddies) => {
				console.log('Loadded buddies');
				initiated = true;
				buddies.value = initialBuddies;
				pending.value = false;
			})
			.catch(() => {
				error.value = true;
				pending.value = false;
			});
	};

	if (!initiated) {
		initiated = true;
		refresh();
	}

	return { buddies, refresh, pending, error };
};
export default useBuddies;
