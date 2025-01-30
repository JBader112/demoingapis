<template>
    <Panel toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
    <div v-if="productsToDisplay && productsToDisplay.length" class="chart-container">
      <h2>{{ chartTitle }}</h2>
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div v-else>
      <p>No data available.</p>
    </div>
</Panel>
</template>

<script setup lang="ts">
import { nextTick, ref, computed, watch, onBeforeUnmount, defineProps } from 'vue';
import Panel from 'primevue/panel';
import { Chart } from 'chart.js/auto';

interface Product {
  partName: string;
  createdDate: string; // e.g. "1/25/2025"
  leadtime: number;
  createdAt?: string;
  updatedAt?: string;
}

const props = defineProps<{ products: Product[] }>();

// Safely handle products in a computed
const productsToDisplay = computed(() => props.products || []);

let chartInstance: Chart | null = null;
const chartCanvas = ref<HTMLCanvasElement | null>(null);

// Chart title (uses first product's partName if available)
const chartTitle = computed(() => {
  if (!productsToDisplay.value.length) {
    return 'Leadtime History';
  }
  return `${productsToDisplay.value[0].partName} Leadtime History`;
});

// Function to build (or rebuild) the chart
async function buildChart() {
  // Destroy existing chart if any
  await nextTick();

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // Bail out if no data or no canvas
  if (!productsToDisplay.value.length || !chartCanvas.value) {
    return;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Prepare labels/data
  const labels = productsToDisplay.value.map(p => p.createdDate);
  const data = productsToDisplay.value.map(p => p.leadtime);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Leadtime',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Leadtime (Weeks)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Created Date',
          },
        },
      },
    },
  });
}

// Watch for changes in products array; build/rebuild chart
watch(
  () => props.products,
  (newProducts) => {
    if (newProducts && newProducts.length > 0) {
      buildChart();
    }
  },
  { deep: true, immediate: true }
);

// Destroy chart instance on unmount to avoid memory leaks
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
