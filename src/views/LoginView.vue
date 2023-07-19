<script setup>
import OAuth from '../Components/OAuth.vue';
import {getAuth ,signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router';
import { ref,toRefs } from 'vue';
import { RouterLink } from 'vue-router';
const userCredentials= ref({
    email:'',
    password:''
})
const router =useRouter()
const {email,password}=toRefs(userCredentials.value)
const onSubmit=async (e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )
     console.log(email,password);
      if (userCredential.user) {
        router.push(`/${userCredential.user.uid}`)
      }
    } catch (error) {
      alert(error)
    }
}
</script>

<template>
    <div class="container  flex justify_center align_center direction_column">
        <h3>Login </h3>
        <form class=" flex justify_center align_center direction_column" @submit="onSubmit">
          <input type="email" name="username" id="username" class="Input" v-model="email" placeholder="Please enter your Email">
          <input type="password" class="Input"  name="password" id="password" v-model="password" placeholder="Please enter your password"> 
          <button type="submit" class="send-button">Log In</button>
          <RouterLink to="/signup" class="send-button">Sign Up</RouterLink>
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