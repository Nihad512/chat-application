<script setup>
import { useRoute,useRouter } from 'vue-router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/init'
const route=useRoute();
const router=useRouter();
const onGoogleClick=async ()=>{
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check for user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // If user, doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      router.push(`/${user.uid}`)
    } catch (error) {
      alert(error)
    }

}
</script>

<template>
<div class="socialLogin">
    <p>Sign {{route.path==="/login" ? 'in': 'up' }} With Google</p>
    <button class="socialIconDiv" @click="onGoogleClick">
        <img className='socialIconImg' src="../assets/svg/googleIcon.svg" alt='google' />
    </button>
</div>
</template>
<style scoped>
.socialLogin {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.socialIconDiv {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  margin: 1.5rem;
  width: 3rem;
  height: 3rem;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
.socialIconImg {
  width: 100%;
}

</style>