<script setup lang="ts">
const count = ref(0);
</script>

<template>
	<button type="button" @click="count++">Counter: {{ count }}</button>
</template>
