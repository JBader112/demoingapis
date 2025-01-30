<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import Authenticate from '@/components/authenticateBanner.vue';
import Instructions from '@/components/instructionsBanner.vue';
import QuoteCreate from '@/components/customComponents/orderCreateTool.vue';
import RequestPayload from '@/components/customComponents/requestPayload.vue';
import ResponseData from '@/components/customComponents/responseData.vue';
import prettyViewOrder from '@/components/customComponents/prettyViewOrder.vue';
import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';

const store = useTIAccessTokenStore();
const response = ref<any[]>([]);
const requestData = ref<any>(null);

const requestHeaders = computed(() => ({
  Authorization: `Bearer ${store.accessToken}`
}));




// Create backlog order based on input data
async function createBacklogOrder(orderData: any) {
  requestData.value = orderData; // Store request data for display

  try {
    const apiResponse = await axios.post('https://transact-pre.ti.com/v2/backlog/orders/test', orderData, {
      headers: requestHeaders.value,
    });
    
    requestData.value = orderData.partNumbers?.join('\n') || JSON.stringify(orderData); // Ensure safe access
    response.value = [apiResponse.data];
  } catch (error: any) {
    console.error('Error creating backlog order:', error);

    // Preserve requestData even in error scenarios
    requestData.value = orderData.partNumbers ? orderData.partNumbers.join('\n') : orderData;

    // Capture error response if available
    response.value = error.response ? [error.response.data] : [{ error: "Request failed", details: error.message }];
  }
}

// Handles input from QuoteCreate
const handleSubmit = (orderData: any) => {
    createBacklogOrder(orderData);
};
</script>

<template>
  <div class="about">
    <Authenticate />
    <Instructions name="QuoteCreate" />
    <QuoteCreate @submit="handleSubmit" />
    <prettyViewOrder :response="response" />
    <div class="flex">
      <RequestPayload 
        :input="requestData" 
        apiUrl="https://transact-pre.ti.com/v2/backlog/orders/test"
        :headers="requestHeaders"
      />
      <ResponseData :response="response" />
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