export default defineEventHandler(async (event) => {
	const args = event.req.method === 'GET' ? event.context.params : await useBody(event);
	console.log('New request: ' + event.req.url, args);
});
