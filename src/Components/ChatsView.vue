<script setup>
import Users from './Users.vue';
import { useRoute,useRouter } from 'vue-router';
import { ref } from 'vue';
import { collection,query,limit,getDocs, where,doc,setDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/init'
const  route=useRoute();
const router=useRouter()
const conversations=ref([])
const uId =route.params.uid;
const searchName=ref('')
const avalibleUsers=ref([])
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

    /* if the clicked user and the current user already have conversation stop it */
    /* later on remove this from here and add it to the search area */
     // Get reference
     const conversationsRef = collection(db, 'conversations')

    // Create a query
    const q = query(
    conversationsRef,
    where('participants',`array-contains`,`${avalibleUser.id}`),
    limit(10)
   )
    // Execute query
    const querySnap = await getDocs(q)

    if(querySnap.docs.length!==0){
      alert('you already have  a conversation with this user')
      return
    }else{
      const conversationId = generateUniqueConversationId();
    
    // Create a document named "conversation_id_3"
    const conversationDocRef = doc(db, 'conversations', conversationId);
    // Add the "participants" field to the "conversation_id_3" document
    await setDoc(conversationDocRef, { participants: [uId, avalibleUser.id] });
  

    console.log('Document and field created successfully');
    router.push(`/chat/:${conversationId}`)
    }
  
    
    
  } catch (error) {
    console.error('Error creating document with participants:', error);
  }
};



   
 
  
 //getting the avalible conversations of our user
 const getConversations = async () => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', `${uId}`));
    const querySnap = await getDocs(q);

    const conversationsData = [];

    for (const doc of querySnap.docs) {
      // Get the conversation data
      const conversationData = doc.data();
      
     

    // Get the messages subcollection reference for each conversation
      const messagesRef = collection(doc.ref, 'messages');

      const messagequery=query(messagesRef,orderBy('timeStamp','desc'),limit(1)) 

      // Perform a query to get all messages within the subcollection
      const messagesQuerySnap = await getDocs(messagequery);
      

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
    conversations.value=conversationsData
    // Now you have all conversation data along with their respective messages in conversationsData array
  } catch (error) {
    alert(error);
  }
};

getConversations()


//Searching the users
const userSearch=async (e)=>{

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
  querySnap.forEach((doc) => {
    if(doc.id==uId){    
      return 
    }else{
      return avalibleUsers.value.push({
            id: doc.id,
            data: doc.data(),
          })
    } 
    });

 } catch (error) {
  alert(error)
 }
 }

}

</script>

<template >
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
 <!-- add the last message username and time when it was sent --> 
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