<template>
  <Panel 
    toggleable 
    :style="{ width: 'calc(100vw - 300px)' }"
    :collapsed="false" 
    header="Quote Details" 
    v-if="parsedQuotes.length"
  >
    <div
      v-for="(quote, index) in parsedQuotes"
      :key="index"
      style="margin-bottom: 1rem"
    >
      <!-- Panel for each quote -->
      <Panel
        :header="`Quote Number: ${quote.quoteNumber} (${quote.customerQuoteNumber})`"
        style="margin-bottom: 1rem"
      >
        <!-- Basic quote info -->
        <div class="quote-info-grid">
          <div class="info-item">
            <strong>Status:</strong> {{ quote.quoteStatus }}
          </div>
          <div class="info-item">
            <strong>Quote Reason:</strong> {{ quote.quoteReason }}
          </div>
          <div class="info-item">
            <strong>Start Date:</strong> {{ formatDate(quote.quoteStartDate) }}
          </div>
          <div class="info-item">
            <strong>End Date:</strong> {{ formatDate(quote.quoteEndDate) }}
          </div>
          <div class="info-item">
            <strong>Profile ID:</strong> {{ quote.checkoutProfileId }}
          </div>
        </div>

        <!-- Line Items Table -->
        <h4>Line Items</h4>
        <DataTable 
          :value="quote.lineItems" 
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <Column field="tiLineItemNumber" header="Line #" />
          <Column field="tiPartNumber" header="TI Part Number" />
          <Column field="quantity" header="Quantity">
            <template #body="slotProps">
              {{ formatNumber(slotProps.data.quantity) }}
            </template>
          </Column>
          <Column field="requestedUnitPrice" header="Unit Price">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.requestedUnitPrice, slotProps.data.requestedUnitPriceCurrencyCode) }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.status"
                :severity="getStatusSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          <Column field="customerItemComments" header="Comments">
            <template #body="slotProps">
              {{ slotProps.data.customerItemComments || 'No comments' }}
            </template>
          </Column>
          
          <!-- Messages Column -->
          <Column header="Messages">
            <template #body="slotProps">
              <div v-if="slotProps.data.messages?.length">
                <div 
                  v-for="(msg, i) in slotProps.data.messages" 
                  :key="i"
                  :class="['message-item', `message-${msg.type.toLowerCase()}`]"
                >
                  <strong>{{ msg.type }}: {{ msg.code }}</strong><br />
                  {{ msg.reason }}<br />
                  {{ msg.message }}
                </div>
              </div>
              <div v-else>
                No Messages
              </div>
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>
  </Panel>

  <Panel header="Quote Details" v-else>
    <p>No Quote Data</p>
  </Panel>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const props = defineProps<{
  response: any[];
}>();

// Extract quotes from the response
const parsedQuotes = computed(() => {
  if (!props.response || !props.response.length) return [];
  const firstItem = props.response[0];
  return (firstItem && firstItem.quotes) ? firstItem.quotes : [];
});

// Format date to local string
function formatDate(date: string) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
}

// Format large numbers with commas
function formatNumber(num: number) {
  if (num === undefined || num === null) return 'N/A';
  return new Intl.NumberFormat().format(num);
}

// Format currency with symbol and decimals
function formatCurrency(amount: number, currency: string) {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Get severity for status tag
function getStatusSeverity(status: string): string {
  const statusMap: Record<string, string> = {
    'Accept': 'success',
    'Pending': 'warning',
    'Rejected': 'danger',
    'Expired': 'info'
  };
  return statusMap[status] || 'info';
}
</script>

<style scoped>
.quote-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.message-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.message-error {
  background-color: #ffe8e8;
  border-left: 3px solid #ff4d4d;
}

.message-warning {
  background-color: #fff8e8;
  border-left: 3px solid #ffb84d;
}

.message-info {
  background-color: #e8f4ff;
  border-left: 3px solid #4d94ff;
}

.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.5rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}
</style>