<template>
    <Panel header="API Response" toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
      <div v-if="response.length > 0">
        <h4>Product Information:</h4>
        <ul>
          <li v-for="product in response" :key="product.Identifier">
            {{ product.Product.Identifier }}: {{ product.Product.LeadTimeWeeks }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No API response available.</p>
      </div>
    </Panel>
</template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import Panel from 'primevue/panel';
  
  defineProps<{ response: Array<any> }>();
  </script>
  