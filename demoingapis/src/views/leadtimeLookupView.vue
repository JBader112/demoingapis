<script setup lang="ts">
import Authenticate from '@/components/authenticateBanner.vue'
</script>


<template>
    <div class="about">
      <Authenticate></Authenticate>
    </div>
</template>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  