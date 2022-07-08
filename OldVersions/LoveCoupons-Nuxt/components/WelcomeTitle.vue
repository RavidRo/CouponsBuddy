<script setup lang="ts">
const getCurrentUser = () => useCurrentUser();
</script>

<template>
	<h1>Welcome {{ getCurrentUser()?.email ?? '' }} To Coupons Buddies</h1>
</template>
