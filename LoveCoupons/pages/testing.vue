<script setup lang="ts">
const data = ref('unset');

const fetch = async () => {
	// useGet<string>('/api/hello')
	// 	.then((res) => (data.value = res))
	// 	.catch((err) => (data.value = err.data.statusMessage));

	usePost<string>('api/friends/invite', { userid: 'WEEE IDDD' })
		.then((res) => (data.value = res as string))
		.catch((err) => (data.value = err.data.statusMessage));
};
</script>

<template>
	<div>
		<button type="button" @click="fetch">Test</button>
		<h3>Result: {{ data }}</h3>
	</div>
</template>
