<!-- Quoteget.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['submit']);

const quoteNumber = ref('');
const customerQuoteNumber = ref('');
const errorMessage = ref('');

const handleSubmit = () => {
  // Reset error message
  errorMessage.value = '';
  
  // Validate that at least one field is filled
  if (!quoteNumber.value && !customerQuoteNumber.value) {
    errorMessage.value = 'Please enter either a Quote Number or Customer Quote Number';
    return;
  }

  // Create the query parameters object
  const queryParams: Record<string, string> = {};
  if (quoteNumber.value) {
    queryParams.quoteNumber = quoteNumber.value;
  }
  if (customerQuoteNumber.value) {
    queryParams.customerQuoteNumber = customerQuoteNumber.value;
  }

  // Emit the query parameters
  emit('submit', queryParams);
};
</script>

<template>
  <div class="quote-get-container p-4 border rounded-lg mb-4">
    <h2 class="text-xl font-bold mb-4">Get Quote</h2>
    
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Quote Number:</label>
      <input 
        v-model="quoteNumber"
        type="text"
        class="w-full p-2 border rounded"
        placeholder="Enter quote number"
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Customer Quote Number:</label>
      <input 
        v-model="customerQuoteNumber"
        type="text"
        class="w-full p-2 border rounded"
        placeholder="Enter customer quote number"
      />
    </div>

    <div v-if="errorMessage" class="text-red-500 mb-4">
      {{ errorMessage }}
    </div>

    <button 
      @click="handleSubmit"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Get Quote
    </button>
  </div>
</template>

<style scoped>
.quote-get-container {
  max-width: 500px;
  width: 100%;
}
</style>