<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/init'
import OAuth from '../Components/OAuth.vue';
import { useRouter,RouterLink } from 'vue-router';
import { ref,toRefs } from 'vue';
const router=useRouter()
const userCredentials= ref({
    name:'',
    email:'',
    password:''
})
const {name,email,password}=toRefs(userCredentials.value)
const onSubmit=async(e)=>{
    e.preventDefault()
   console.log(name,email,password);
try {
  const auth = getAuth()
  
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
 
 
  
  const user = userCredential.user
  const userCredentialsCopy={...userCredentials.value};
  delete userCredentialsCopy.password
  userCredentialsCopy.timeStamp=serverTimestamp()

  await setDoc(doc(db, 'users', user.uid), userCredentialsCopy)
  router.push(`/${user.uid}`)
} catch (error) {
  alert(error)
}
}
</script>
<template>
<div class="container  flex justify_center align_center direction_column">
        <h3>Sign Up </h3>
        <form class=" flex justify_center align_center direction_column" @submit="onSubmit">
          <input type="text" name="username" id="username" class="Input" v-model="name" placeholder="Please enter your Name">
          <input type="email" name="email" id="email" class="Input" v-model="email"  placeholder="Please enter your Email">
          <input type="password" class="Input"  name="password" id="password" v-model="password" placeholder="Please enter your password"> 
          <button type="submit" class="send-button">Sign Up</button>
          <RouterLink to="/login" class="send-button">Log in Instead</RouterLink>
        </form>
        <OAuth />
    </div>
</template>
<style scoped>
a{
  text-decoration: none;
}
*{
    margin-bottom: 20px;
}
form{
    width: 100%;
}
.Input{
    width: 50%;
    height: 46px;
    padding: 5px;
    border-radius: 10px;
    background: #3C3C3C;
}

.send-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>