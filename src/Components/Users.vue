<script setup>

import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/init';
import { useRoute } from 'vue-router';
const usernameFetched = ref(false);
const { conversation } = defineProps(['conversation']);
const route=useRoute()
const {content, sendBy,timeStamp}= conversation.data.messages[0].data 
const sent=ref(false);
const username = ref('');
if(route.params.uid===sendBy){
    sent.value=true
}
// Fetch the user's name when the component is mounted
onMounted(async () => {
  // Get the user document reference
  const userRef = doc(db, 'users', conversation.data.participants[1]);

  try {
    // Fetch the user document data
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update the username with the user's name from the document
      username.value = userDoc.data().name;
       usernameFetched.value =true;
    } else {
      console.log('User document not found.');
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
  }
});


</script>

<template>
    <div  v-if="usernameFetched" class="users flex justify_center direction_row">
    <span class="flex direction_row user">
    <span class="flex direction_column">
     <h3 class="userName">{{ username }}</h3>
     <!-- late on change this if the user send the message it will be green or white -->
     <p :class="`lastMsg ${sent ? 'sent' :'received'}`">{{content}}</p>
     <p>{{ timeStamp.slice(10,15) }}</p>
    </span>
</span>
</div>
</template>
<style scoped>
.sent{
    color: #036825;
}
.received{
    color: white;
}

.userName{
    color: #7FFFAB;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;
}

.lastMsg{
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: normal;
}
.user{
    cursor: pointer;
}
</style>