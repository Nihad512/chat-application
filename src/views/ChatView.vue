<script setup>
  import MessageItem from '../Components/MessageItem.vue';
  import { ref, onUnmounted } from 'vue';
  import {
    collection,
    getDocs,
    addDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
  } from 'firebase/firestore';
  import { db } from '../firebase/init';
  import { getAuth } from 'firebase/auth';
  import { useRoute, useRouter } from 'vue-router';

  const time = new Date();
  const today = time.toLocaleString();
  const Auth = getAuth();
  const route = useRoute();
  const router = useRouter();
  const conversationId = route.params.id.slice(1);
  const currentMessage = ref('');
  const messages = ref([]);

  const getMessages = async () => {
    try {
      const conversationDocRef = doc(db, 'conversations', conversationId);
      const messagesCollectionRef = collection(conversationDocRef, 'messages');
      const q = query(messagesCollectionRef, orderBy('timeStamp'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            message: data.content,
            sentBy: data.sendBy,
            timeStamp: data.timeStamp,
          };
        });
      });

      // Unsubscribe from the listener when the component is unmounted
      onUnmounted(unsubscribe);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };

  const messageSender = async () => {
    if (currentMessage.value === '') {
      alert('Please Write a Message');
    } else {
      try {
        const conversationDocRef = doc(db, 'conversations', conversationId);
        const messagesCollectionRef = collection(
          conversationDocRef,
          'messages'
        );

        await addDoc(messagesCollectionRef, {
          content: currentMessage.value,
          sendBy: Auth.currentUser.uid,
          timeStamp: today,
        });

        currentMessage.value = '';
      } catch (error) {
        console.error('Error creating message:', error);
      }
    }
  };

  getMessages();
</script>

<template>
  <div class="rightSide flex direction_column">
    <div class="rightSideTop">
      <h3 class="username">Nihad</h3>
      <button @click="router.go(-1);" class="send-button">Previous Page</button>
    </div>
    <div class="messages flex direction_column">
      <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>
    <div class="sendMessageBox flex justify_center align_center justify_between">
      <input
        v-model="currentMessage"
        type="text"
        class="sendMessage"
        @keyup.enter="messageSender"
        placeholder="Type your message Here"
      />
      <button @click="messageSender" class="send-button">Send</button>
    </div>
  </div>
</template>

<style scoped>
  .sendMessageBox {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 64px;
    border-radius: 10px;
    background: #282828;
    padding: 0 20px;
  }

  .sendMessage {
    width: 60%;
    height: 46px;
    padding: 5px;
    border-radius: 10px;
    background: #3c3c3c;
    color: white;
  }

  .send-button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .send-button:hover {
    background-color: #45a049;
  }

  .send-button:active {
    background-color: #3e8e41;
  }

  .username {
    color: white;
  }
</style>
