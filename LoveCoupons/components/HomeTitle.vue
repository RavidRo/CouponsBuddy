<script setup lang="ts">
const { $auth } = useNuxtApp();
const userName = $auth.currentUser?.email ?? '';
console.log('HEYY', $auth);
console.log('HEYY2', $auth.currentUser);
</script>

<template>
	<h1>Welcome {{ userName }} To Coupons Buddies</h1>
</template>
