<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from 'amplify/data/resource'
import Authenticate from '@/components/authenticateBanner.vue';
import Instructions from '@/components/instructionsBanner.vue';
import LeadtimeLookup from '@/components/customComponents/leadtimeLookup.vue';
import prettyViewLeadtime from '@/components/customComponents/prettyViewLeadtimeTracker.vue';


// Import the new chart component
import LeadtimeChart from '@/components/customComponents/LeadtimeChart.vue';

const client = generateClient<Schema>()
const inputText = ref<string>('');
const products = ref<Array<any>>([]); // Store API response


// Fetch product data from AWS Amplify
async function fetchProductData(partNumbers: string) {
  const identifiers = partNumbers.split(/[\n,]+/).map(s => s.trim());
  const filteredIdentifiers = identifiers.filter(identifier => identifier !== '');

  try {
    products.value = []; // Reset products array

    for (const identifier of filteredIdentifiers) {
      const response = await client.models.leadtimeTracker.list({
        filter: {
          partName: { eq: identifier }
        }
      });

      if (response.data && response.data.length > 0) {
        products.value.push(...response.data);
      }
    }
  } catch (error) {
    console.error('Error fetching leadtime data:', error);
  }
}

// Handles input from LeadtimeLookup
const handleSubmit = (partNumbers: string) => {
  inputText.value = partNumbers;
  fetchProductData(partNumbers);
};
</script>

<template>
    <div class="about">
      <Authenticate />
      <Instructions name="LeadtimeLookup" />
  
      <LeadtimeLookup @submit="handleSubmit" />
  
      <!-- Only show these components if products array is non-empty -->
      <prettyViewLeadtime 
        :response="products" 
      />
  
      <LeadtimeChart 
        :products="products" 
      />
    </div>
  </template>
  

<style>
.flex {
  display: flex;
  flex-direction: row;
  gap: 0rem;
}
.about {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
</style>
