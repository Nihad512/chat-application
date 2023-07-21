<script setup>
import Users from './Users.vue';
import { useRoute,useRouter } from 'vue-router';
import { ref } from 'vue';
import { collection,query,limit,getDocs, where,doc,setDoc, orderBy,deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/init'
import Spinner from '../Components/Spinner.vue'
const  route=useRoute();
const router=useRouter()
const conversations=ref([])
const uId =route.params.uid;
const searchName=ref('')
const avalibleUsers=ref([])
const loading =ref(true);
/* add loading tomorrow i am really not in mood rn */
const generateUniqueConversationId = () => {
  // Generate a timestamp-based ID
  const timestamp = Date.now().toString();
  const randomId = Math.random().toString(36).substring(2, 10);
  const conversationId = `${timestamp}${randomId}`;

  return conversationId;
};
  //creating a conversation for our user

const createConversations = async (avalibleUser) => {
  try {

      const conversationId = generateUniqueConversationId();
    
    // Create a document named "conversation_id_3"
    const conversationDocRef = doc(db, 'conversations', conversationId);
    // Add the "participants" field to the "conversation_id_3" document
    await setDoc(conversationDocRef, { participants: [uId, avalibleUser.id] });
    
    
    console.log('Document and field created successfully');
    router.push(`/chat/:${conversationId}`)
    
  
    
    
  } catch (error) {
    console.error('Error creating document with participants:', error);
  }
};



   
 
  
const getConversations = async () => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', uId));
    const querySnap = await getDocs(q);
    const conversationsData = [];

    for (const doc of querySnap.docs) {
      // Get the conversation data
      const conversationData = doc.data();

      // Get the messages subcollection reference for each conversation
      const messagesRef = collection(doc.ref, 'messages');

      const messageQuery = query(messagesRef, orderBy('timeStamp', 'desc'), limit(1));

      // Perform a query to get all messages within the subcollection
      const messagesQuerySnap = await getDocs(messageQuery);

      // Check if the messages subcollection is empty
      if (messagesQuerySnap.empty) {
        // Delete the conversation since it doesn't have any messages
        await deleteDoc(doc.ref);
        continue; // Skip processing this conversation since it has been deleted
      }

      // Extract messages data from the query snapshot
      const messagesData = messagesQuerySnap.docs.map((messageDoc) => {
        return {
          id: messageDoc.id,
          data: messageDoc.data(),
        };
      });

      // Add messages data to the conversation data
      conversationData.messages = messagesData;

      // Push the updated conversation data to the conversationsData array
      conversationsData.push({
        id: doc.id,
        data: conversationData,
      });
    }

    conversations.value = conversationsData;
    loading.value = false;
    // Now you have all conversation data along with their respective messages in conversationsData array
  } catch (error) {
    alert(error);
  }
};

getConversations();


//Searching the users
const userSearch=async (e)=>{
  loading.value=true
  e.preventDefault();
 if(searchName.value==''){
  alert('Please enter a name ')
 }else{
  
  try {
  const usersRef= collection(db,'users')
  const q=query(
    usersRef,
    where('name',`>=`,searchName.value)
  )
  const querySnap=await getDocs(q)
  querySnap.forEach(async(doc) => {
    const conversationsRef = collection(db, 'conversations');
    const conv_queryq = query(conversationsRef, where('participants', 'array-contains', `${doc.id}`));
    const conversation_query = await getDocs(conv_queryq);
    ;
    
    if(doc.id==uId){    
      return 
    }
    if(conversation_query.docs.length!==0){
      
      return
    }else{
      return avalibleUsers.value.push({
            id: doc.id,
            data: doc.data(),
            
          })
    } 
    
    
    });
    loading.value=false
 } catch (error) {
  alert(error)
 }
 }

}

</script>

<template >
  <Spinner v-show="loading" />
<div class="leftSide flex direction_column">
    <div class="currentUser flex  justify_center align_center justify_between">
 <span class="flex direction_column">
  <h2>Create a conversaiton with our users</h2>
<form class="flex direction_row justify_between" @submit="userSearch" >

<input type="text" class="Input" name="conversation" v-model="searchName" id="conversation">
<button class="submit-button" type="submit">Search</button>

</form>
 </span>


</div >
  <div class="flex direction_row usersContainer">
    <Users v-show="avalibleUsers.length==0"  v-for="conversation in conversations" @click="()=>{
   router.push(`/chat/:${conversation.id}`)
  
} " :key="conversation.id" :conversation="conversation" ></Users> 

  </div>

 <span class="usernameContainer"  v-if="avalibleUsers.length>0" :key="avalibleUser.id" v-for="avalibleUser in avalibleUsers" >
  <p @click="createConversations(avalibleUser)" class="username" >{{ avalibleUser.data.name }}</p>
</span>
</div>
</template>
<style scoped>
.currentUser{
  align-self: center;
}
.usersContainer{
  gap: 20px;
}
.usernameContainer{
  padding: 4px;
  width: fit-content;
  height: 35px;
  border: 1px solid #4CAF50;
  cursor: pointer;
  margin-bottom: 20px;
}
form{
  margin-bottom: 20px;
}
.Input{
    width: 75%;
    height: 46px;
    padding: 5px;
    border-radius: 10px;
    background: #3C3C3C;
}
.submit-button {
  padding: 10px ;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
h2{
    color: white;
    justify-self: center;
    align-self: center;
    margin-bottom: 20px;
}

.leftSide{
  padding: 20px;
    width: 100%;
    float: left;
}
.username{
    color: white;
}


</style>