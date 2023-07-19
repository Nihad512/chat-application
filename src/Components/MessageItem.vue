<script setup>
import { defineProps } from 'vue';
const {message}=defineProps(['message'])
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
const Auth=getAuth()
const sent=ref(false);
console.log(Auth.currentUser.uid,message.sentBy);
if(message.sentBy==Auth.currentUser.uid){
    sent.value=true
}
</script>


<template>

<div :class="`flex messageItem ${sent ? 'sent' :'received'}`">
        <p class="message">{{ message.message }}</p>
        <p class="message">{{ message.timeStamp }}</p>
    </div>
    
</template>
<style scoped>

.sent{
    align-self: flex-end;
    padding: 5px ;
    background: #036825;
}
.received{
    align-self: flex-start;
    padding: 5px;
    background: #272727;
}
.message{
    color: white;
}
.messageItem{
    border-radius: 0px 10px 10px 10px;
    margin-bottom: 10px;
}
</style>