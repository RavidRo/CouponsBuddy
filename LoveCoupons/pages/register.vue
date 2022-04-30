<script setup lang="ts">
import { createUserWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');

const onSubmit = (_e: Event) => {
	const { $auth } = useNuxtApp();
	createUserWithEmailAndPassword($auth, email.value, password.value)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.log('Welcome!', user);
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
		<h1>Register</h1>
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
			<button id="sign-in-recaptcha" type="submit">Register</button>
		</form>
	</div>
</template>
