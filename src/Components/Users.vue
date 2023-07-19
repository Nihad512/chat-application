<script setup>
import { defineProps } from 'vue';
const {conversation}=defineProps(['conversation'])
</script>

<template>
    <div class="users flex justify_center direction_column">
<span class="flex direction_row user">
    <span class="profile_picture">
    <img src="../assets/images/Ellipse 9.png" class="full_width full_height" alt="">
    </span>
    <span class="flex direction_column">
     <h3 class="userName">{{ conversation.data.name }}</h3>
     <p class="lastMsg">Hello What's up?</p>
    </span>
</span>
</div>
</template>
<style scoped>

.profile_picture{
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 1px solid #7FFFAB;
    margin-right: 10px;
}
.userName{
    color: #7FFFAB;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;
}
.lastMsg{
    color: #FFF;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: normal;
}
.user{
    cursor: pointer;
}
</style>