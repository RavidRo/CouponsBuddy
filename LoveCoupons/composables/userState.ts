type UserState = 'unknown' | 'loggedIn' | 'loggedOut';

export const useLoggedState = () => useState<UserState>('userState', () => 'unknown');
export const useIsLoggedIn = () => useLoggedState().value === 'loggedIn';
export const useCurrentUser = () => {
	if (useIsLoggedIn()) {
		const { $auth } = useNuxtApp();
		return $auth?.currentUser;
	}
	return null;
};
