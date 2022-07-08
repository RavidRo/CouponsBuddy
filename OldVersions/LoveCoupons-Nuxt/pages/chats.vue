<script setup lang="ts">
import {
	doc,
	onSnapshot,
	getFirestore,
	Unsubscribe,
	updateDoc,
	arrayUnion,
	Timestamp,
} from 'firebase/firestore';

const { buddies, pending } = useBuddies();
const messages = ref<Message[]>([]);
const currentChat = ref<string>();
const messageContent = ref<string>('');
let unlisten: Unsubscribe = () => {};
const db = getFirestore();

const listen = (chatID: string) => {
	unlisten();
	currentChat.value = chatID;
	unlisten = onSnapshot(doc(db, 'Chats', chatID), (doc) => {
		const chat = doc.data();
		messages.value = chat?.messages;
	});
};

const user = useCurrentUser();
const send = () => {
	if (currentChat.value) {
		const message: Message = {
			content: messageContent.value,
			sender: user?.email!,
			'sender-uid': user?.uid!,
			'sent-at': Timestamp.now(),
		};
		const chatRef = doc(db, 'Chats', currentChat.value);
		updateDoc(chatRef, {
			messages: arrayUnion(message),
		});
	}
};

onUnmounted(() => {
	unlisten();
});
</script>

<template>
	<div>
		<h1>Messages</h1>
		<h3 v-if="pending">Loading Buddies...</h3>
		<button @click="listen(buddy.chat)" v-for="buddy in buddies">
			{{ buddy.name }}
		</button>
		<ul>
			<li v-for="message in messages">{{ message.content }}</li>
		</ul>
		<input
			type="text"
			autocomplete="on"
			required
			v-model="messageContent"
			placeholder="Say hello..."
		/>
		<button @click="send">SEND</button>
	</div>
</template>
