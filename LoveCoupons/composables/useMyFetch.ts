import { SearchParams } from 'ohmyfetch';

const getHeaders = async (): Promise<HeadersInit> => {
	const token = await useCurrentUser()?.getIdToken(true);
	return {
		Authorization: token ?? '',
	};
};

export const useGet = async <T>(request: string, params: SearchParams = {}) => {
	return $fetch<T>(request, {
		headers: await getHeaders(),
		method: 'GET',
		params: params,
	});
};

export const usePost = async <T>(request: string, body: Record<string, any> = {}) => {
	return $fetch<T>(request, {
		headers: await getHeaders(),
		method: 'POST',
		body: body,
	});
};
