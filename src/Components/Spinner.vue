<script setup>

</script>

<template>
    <div class="spinner-overlay">
      <div class="spinner">
       <img src='../assets/images/Spinner.gif' alt="" srcset="">
      </div>
    </div>
  </template>
  
  <style scoped>
  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure the spinner is on top of other content */
  }
  
  .spinner {
    font-size: 20px;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  </style>