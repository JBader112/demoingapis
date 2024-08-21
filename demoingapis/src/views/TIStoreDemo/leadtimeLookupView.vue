<script setup lang="ts">
import Authenticate from '@/components/authenticateBanner.vue'
import Instructions from '@/components/instructionsBanner.vue'
import LeadtimeLookup from '@/components/customComponents/leadtimeLookup.vue'
</script>


<template>
    <div class="about">
      <Authenticate></Authenticate>
      <Instructions name="LeadtimeLookup"/>
      <LeadtimeLookup></LeadtimeLookup>
    </div>
</template>
  
  <style>
    .about {

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start; /* Ensures the component stays at the top */
    }
  </style>
  