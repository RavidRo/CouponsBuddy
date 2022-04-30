<script setup lang="ts">
import { signInWithEmailAndPassword } from '@firebase/auth';

const email = ref('');
const password = ref('');

const onSubmit = (_e: Event) => {
	const { $auth } = useNuxtApp();
	signInWithEmailAndPassword($auth, email.value, password.value)
		.then(() => {
			navigateTo({ path: '/' });
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error(errorCode, errorMessage);
		});
};
</script>

<template>
	<div>
		<h1>Login</h1>
		<form @submit.prevent="onSubmit">
			<p>Email is: {{ email }}</p>
			<input type="email" autocomplete="email" required v-model="email" placeholder="Email" />
			<input
				type="password"
				autocomplete="current-password"
				required
				placeholder="Password"
				v-model="password"
			/>
			<button id="sign-in-recaptcha" type="submit">Sign In</button>
		</form>
	</div>
</template>
