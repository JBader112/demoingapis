<template>
    <Panel header="Leadtime Summary" toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
      <div v-if="response.length > 0">
        <h4>Leadtime Stats:</h4>
        <ul>
          <li><strong>Maximum Leadtime:</strong> {{ maxLeadtime }} weeks</li>
          <li><strong>Minimum Leadtime:</strong> {{ minLeadtime }} weeks</li>
          <li><strong>Average Leadtime:</strong> {{ avgLeadtime }} weeks</li>
        </ul>
      </div>
      <div v-else>
        <p>No leadtime data available.</p>
      </div>
    </Panel>
</template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import Panel from 'primevue/panel';
  
  // Accept an array of product objects, each with { partName, createdDate, leadtime, ... }
  const props = defineProps<{ response: Array<{ partName: string; createdDate: string; leadtime: number }> }>();
  
  // Pull out just the numeric leadtime values
  const leadtimes = computed(() => {
    return props.response
      .map(item => Number(item.leadtime))
      .filter(lt => !isNaN(lt));
  });
  
  // Compute max leadtime
  const maxLeadtime = computed(() => {
    return leadtimes.value.length > 0
      ? Math.max(...leadtimes.value)
      : 0; // or "N/A"
  });
  
  // Compute min leadtime
  const minLeadtime = computed(() => {
    return leadtimes.value.length > 0
      ? Math.min(...leadtimes.value)
      : 0; // or "N/A"
  });
  
  // Compute average leadtime
  const avgLeadtime = computed(() => {
    if (leadtimes.value.length === 0) return 0; // or "N/A"
    const sum = leadtimes.value.reduce((acc, val) => acc + val, 0);
    return (sum / leadtimes.value.length).toFixed(2);
  });
  </script>
  