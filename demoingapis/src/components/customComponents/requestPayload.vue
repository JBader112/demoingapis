<template>
  <Panel header="Request Payload" toggleable :collapsed="false" :style="{ width: 'calc(50vw - 150px)' }">
    <div>
      <div class="section">
        <p><strong>API URL:</strong></p>
        <pre>{{ apiUrl }}</pre>
      </div>
      
      <div class="section">
        <p><strong>Headers:</strong></p>
        <pre>{{ formattedHeaders }}</pre>
      </div>

      <div class="section" v-if="input">
        <p><strong>Request Body:</strong></p>
        <pre>{{ formattedInput }}</pre>
      </div>

      <div class="section" v-else>
        <p><strong>Request Body:</strong></p>
        <pre>No request body (GET request)</pre>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import Panel from 'primevue/panel';

const props = defineProps<{ 
  input?: string; // Make input optional
  apiUrl: string;
  headers: Record<string, string>;
}>();

// Format input as JSON only if it exists
const formattedInput = computed(() => {
  if (!props.input) return null;

  try {
    // If it's already a valid JSON object, parse it and return formatted JSON
    const parsedInput = typeof props.input === 'string' ? JSON.parse(props.input) : props.input;
    return JSON.stringify(parsedInput, null, 2);
  } catch (error) {
    console.error("Error parsing input JSON:", error);
    return "Invalid JSON format";
  }
});

// Format headers as JSON
const formattedHeaders = computed(() => JSON.stringify(props.headers, null, 2));
</script>

<style scoped>
.section {
  margin-bottom: 1.5rem;
}

.section:last-child {
  margin-bottom: 0;
}

pre {
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0.5rem 0;
}

strong {
  color: #333;
}
</style>