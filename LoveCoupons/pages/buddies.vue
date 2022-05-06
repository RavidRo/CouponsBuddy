<script setup lang="ts">
const initialBuddies = await useGet<string[]>('api/buddies');
const buddies = ref(initialBuddies);
const emailToInvite = ref('');

const fetch = async () => {
	usePost<string>('api/buddies/invite', { emailToInvite: emailToInvite.value })
		.then((res) => buddies.value.push(res))
		.catch((err) => buddies.value.push(err.data.statusMessage));
};
</script>

<template>
	<div>
		<input
			type="email"
			autocomplete="email"
			required
			v-model="emailToInvite"
			placeholder="Email"
		/>
		<button @click="fetch">Invite!</button>
		<ul>
			<li v-for="buddy in buddies">
				{{ buddy }}
			</li>
		</ul>
	</div>
</template>
