<template>
  <Panel header="API Response" toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
    <DataTable v-if="flattenedResponse.length > 0" :value="flattenedResponse" responsiveLayout="scroll">
      <!-- Dynamically generate columns based on available keys -->
      <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header">
        <template v-if="column.isLink" #body="slotProps">
          <a :href="slotProps.data[column.field]" target="_blank">Link</a>
        </template>
        <template v-else-if="column.isBoolean" #body="slotProps">
          {{ slotProps.data[column.field] ? "Yes" : "No" }}
        </template>
        <template v-else-if="column.isObject" #body="slotProps">
          {{ JSON.stringify(slotProps.data[column.field], null, 2) }}
        </template>
        <template v-else #body="slotProps">
          {{ slotProps.data[column.field] }}
        </template>
      </Column>
    </DataTable>
    <div v-else>
      <p>No API response available.</p>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const props = defineProps<{ response: Array<any> }>();

// Function to flatten the nested response into key-value pairs
const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey)); // Recursively flatten
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};

// Flatten the entire response list
const flattenedResponse = computed(() =>
  props.response.map((item) => flattenObject(item))
);

// Extract all unique column keys dynamically
const columns = computed(() => {
  if (!flattenedResponse.value.length) return [];

  const firstItem = flattenedResponse.value[0];
  return Object.keys(firstItem).map((key) => ({
    field: key,
    header: key.replace(/\./g, " "), // Format header nicely
    isLink: key.toLowerCase().includes("url"), // Detect URLs
    isBoolean: typeof firstItem[key] === "boolean", // Detect boolean values
    isObject: typeof firstItem[key] === "object", // Detect objects
  }));
});
</script>
