<script setup lang="ts">
import { signOut } from 'firebase/auth';

const isLoggedIn = useIsLoggedIn;

const handleSignOut = () => {
	const { $auth } = useNuxtApp();
	signOut($auth).then(() => {
		const state = useLoggedState();
		isLoggedIn();
		state.value = 'loggedOut';
	});
};
</script>

<template>
	<div>
		<NuxtLink to="/" class="mr-2">Home</NuxtLink>
		<NuxtLink to="/testing" class="mr-2">Testing</NuxtLink>
		<NuxtLink v-show="!isLoggedIn()" to="/login" class="mr-2">Login</NuxtLink>
		<NuxtLink v-show="!isLoggedIn()" to="/register" class="mr-2">Register</NuxtLink>
		<NuxtLink v-show="isLoggedIn()" to="/buddies" class="mr-2">My Buddies</NuxtLink>
		<NuxtLink v-show="isLoggedIn()" to="/chats" class="mr-2">Chats</NuxtLink>
		<a v-show="isLoggedIn()" @click="handleSignOut" href="#">Sign Out</a>
		<hr />
		<slot />
	</div>
</template>
