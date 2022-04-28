<script setup lang="ts">
const { $auth } = useNuxtApp();
const count = ref(0);
</script>

<template>
	<button type="button" @click="count++">Counter: {{ count }}</button>
</template>
