<template>
    <Panel header="API Response" toggleable :collapsed="false" :style="{ width: 'calc(50vw - 150px)' }">
      <div v-if="response.length > 0">
        <p><strong>Raw API Response:</strong></p>
        <pre>{{ formattedResponse }}</pre>
      </div>
      <div v-else>
        <p>No API response available.</p>
      </div>
    </Panel>
</template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import Panel from 'primevue/panel';
  
  const props = defineProps<{ response: Array<any> }>();
  
  // Format response as pretty JSON
  const formattedResponse = computed(() => JSON.stringify(props.response, null, 2));
  </script>
  