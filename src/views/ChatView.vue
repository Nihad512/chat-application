<script setup>
  import MessageItem from '../Components/MessageItem.vue';
  import { ref, onUnmounted } from 'vue';
  import {
    collection,
    addDoc,
    doc,
    query,
    orderBy,
    onSnapshot
  } from 'firebase/firestore';
  const loading =ref(true);
  import Spinner from '../Components/Spinner.vue';
  import { db } from '../firebase/init';
  import { getAuth,onAuthStateChanged } from 'firebase/auth';
  import { useRoute, useRouter } from 'vue-router';
  const Authenticator=getAuth()
  const route = useRoute();
  const router = useRouter();
  const conversationId = route.params.id.slice(1);
  const currentMessage = ref('');
  const messages = ref([]);
  const username=ref('')

 
  const getUserName = async () => {
    return new Promise((resolve, reject) => {
      const Auth = getAuth();

      onAuthStateChanged(Auth, (user) => {
        if (user) {
          username.value = user.displayName;
          resolve();
        } else {
          reject('User not authenticated.');
        }
      });
    });
  };


  const getMessages = async () => {
    try {
      const conversationDocRef = doc(db, 'conversations', conversationId);
      const messagesCollectionRef = collection(conversationDocRef, 'messages');
      const q = query(messagesCollectionRef, orderBy('timeStamp',"asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data.sendBy);
          return {
            id: doc.id,
            message: data.content,
            sentBy: data.sendBy,
            timeStamp: data.timeStamp,
          };
          
        });
        loading.value=false
      });
      
      // Unsubscribe from the listener when the component is unmounted
      onUnmounted(unsubscribe);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };

  const messageSender = async () => {
    const time = new Date();

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
          sendBy: Authenticator.currentUser.uid,
          timeStamp: time.toLocaleString('pl-PL'),
        });
        
        currentMessage.value = '';
      } catch (error) {
        console.error('Error creating message:', error);
      }
    }
  };
  const initializeChat = async () => {
    await getUserName();
    getMessages();
  };

  // Call the function to initialize the chat
  initializeChat();

</script>

<template>
  <Spinner v-show="loading" />
  <div class="rightSide flex direction_column">
    <div class="rightSideTop">
      <h3 class="username">{{ username }}</h3>
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
