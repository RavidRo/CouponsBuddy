<script setup lang="ts">
const initialBuddies = await useGet<string[]>('api/buddies');
const buddies = ref(initialBuddies);

const fetch = async () => {
	const user = useCurrentUser();
	usePost<string>('api/buddies/invite', { userid: user?.uid })
		.then((res) => buddies.value.push(res))
		.catch((err) => buddies.value.push(err.data.statusMessage));
};
</script>

<template>
	<button @click="fetch">Invite!</button>
	<ul>
		<li v-for="buddy in buddies">
			{{ buddy }}
		</li>
	</ul>
</template>
