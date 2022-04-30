<script setup lang="ts">
const isKnownState = computed(() => {
	const loggedState = useLoggedState();
	return loggedState.value !== 'unknown';
});
</script>

<template>
	<!-- <NuxtLayout name="custom"> </NuxtLayout> -->
	<NuxtLayout name="custom" v-if="isKnownState">
		<NuxtPage />
	</NuxtLayout>
	<h1 v-else>Loading...</h1>
</template>
