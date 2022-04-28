<template>
	<div>
		<NuxtLink to="/" class="mr-2">Home</NuxtLink>
		<NuxtLink to="/login" class="mr-2">Login</NuxtLink>
		<NuxtLink to="/register">Register</NuxtLink>
		<hr />
		<slot />
	</div>
</template>
