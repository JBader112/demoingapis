<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import Authenticate from '@/components/authenticateBanner.vue';
import Instructions from '@/components/instructionsBanner.vue';
import LeadtimeLookup from '@/components/customComponents/leadtimeLookup.vue';
import prettyView from '@/components/customComponents/prettyViewPartInfo.vue';
import RequestPayload from '@/components/customComponents/requestPayload.vue';
import ResponseData from '@/components/customComponents/responseData.vue';
import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';

const store = useTIAccessTokenStore();
const inputText = ref<string>('');
const products = ref<Array<any>>([]); // Store API response
const body = ""

const requestHeaders = computed(() => ({
  Authorization: `Bearer ${store.accessToken}`
}));

const firstInputValue = computed(() => {
  const identifiers = inputText.value.split(/[\n,]+/).map(s => s.trim());
  return identifiers.length > 0 ? identifiers[0] : '';
});



// Fetch product data based on input
async function fetchProductData(partNumbers: string) {
    const identifiers = partNumbers.split(/[\n,]+/).map(s => s.trim());
    const filteredIdentifiers = identifiers.filter(identifier => identifier !== '');

    try {
        products.value = []; // Reset products array

        for (const identifier of filteredIdentifiers) {
            const response = await axios.get(`https://transact.ti.com/v1/products-extended/${identifier}`, {
                headers: requestHeaders.value,
            });

            products.value.push(response.data);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
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
    <prettyView :response="products" />
    <div class="flex">
      <!-- Pass the API URL -->
      <RequestPayload 
        :input="body" 
        :apiUrl="`https://transact.ti.com/v1/products-extended/${firstInputValue}`"
        :headers="requestHeaders"
      />
      <ResponseData :response="products" />
    </div>
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
