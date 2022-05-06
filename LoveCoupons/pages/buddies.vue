<script setup lang="ts">
const { buddies, pending } = useBuddies();
const emailToInvite = ref('');

const fetch = async () => {
	console.log(buddies.value);
	usePost<Buddy>('api/buddies/invite', { emailToInvite: emailToInvite.value })
		.then((res) => {
			buddies.value.push(res);
		})
		.catch((err) => alert(err.data.statusMessage));
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
		<h3 v-if="pending">Loading buddies...</h3>
		<ul v-else>
			<li v-for="buddy in buddies">
				{{ buddy.name }}
			</li>
		</ul>
	</div>
</template>
