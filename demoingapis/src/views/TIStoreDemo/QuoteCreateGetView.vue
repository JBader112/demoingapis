<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import Authenticate from '@/components/authenticateBanner.vue';
import Instructions from '@/components/instructionsBanner.vue';
import QuoteCreate from '@/components/customComponents/quoteCreateTool.vue';
import RequestPayload from '@/components/customComponents/requestPayload.vue';
import quoteGet from '@/components/customComponents/quoteGet.vue';
import ResponseData from '@/components/customComponents/responseData.vue';
import prettyViewOrder from '@/components/customComponents/prettyViewQuote.vue';
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
    const apiResponse = await axios.post('https://transact-pre.ti.com/v2/backlog/quotes/test', orderData, {
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

async function getQuote(queryParams: any) {
  requestData.value = queryParams;

  try {
    const apiResponse = await axios.get('https://transact-pre.ti.com/v2/backlog/quotes/test', {
      headers: requestHeaders.value,
      params: queryParams
    });
    
    requestData.value = JSON.stringify(queryParams);
    response.value = [apiResponse.data];
  } catch (error: any) {
    console.error('Error getting quote:', error);
    requestData.value = JSON.stringify(queryParams);
    response.value = error.response ? [error.response.data] : [{ error: "Request failed", details: error.message }];
  }
}

// Handles input from QuoteCreate
const handleSubmit = (orderData: any) => {
    createBacklogOrder(orderData);
};

const handleGetQuote = (queryParams: any) => {
    getQuote(queryParams);
};

</script>

<template>
  <div class="about">
    <Authenticate />
    <Instructions name="QuoteCreate" />
    <quoteGet @submit="handleGetQuote" />
    <QuoteCreate @submit="handleSubmit" />
    <prettyViewOrder :response="response" />
    <div class="flex">
      <RequestPayload 
        :input="requestData" 
        apiUrl="https://transact-pre.ti.com/v2/backlog/quotes/test"
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