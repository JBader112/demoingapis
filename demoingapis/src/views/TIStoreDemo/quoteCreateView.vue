<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import Authenticate from '@/components/authenticateBanner.vue';
import Instructions from '@/components/instructionsBanner.vue';
import QuoteCreate from '@/components/customComponents/quoteCreateTool.vue';
import prettyView from '@/components/customComponents/prettyViewPartInfo.vue';
import RequestPayload from '@/components/customComponents/requestPayload.vue';
import ResponseData from '@/components/customComponents/responseData.vue';
import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';

const store = useTIAccessTokenStore();
const response = ref<any[]>([]);
const requestData = ref<any>(null);

const requestHeaders = computed(() => ({
  Authorization: `Bearer ${store.accessToken}`
}));

// Create backlog order based on input data
async function createBacklogOrder(orderData: any) {
    try {
        requestData.value = orderData; // Store request data for display
        const apiResponse = await axios.post('https://transact.ti.com/v2/backlog/orders/test', orderData, {
            headers: requestHeaders.value,
        });
        response.value = apiResponse.data;
    } catch (error) {
        console.error('Error creating backlog order:', error);
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
    <prettyView :response="response" />
    <div class="flex">
      <RequestPayload 
        :input="requestData" 
        apiUrl="https://transact.ti.com/v2/backlog/orders/test"
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