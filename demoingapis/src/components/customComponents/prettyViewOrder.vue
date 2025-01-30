<template>
    <Panel toggleable :style="{ width: 'calc(100vw - 300px)' }"
    :collapsed="false" header="Order Details" v-if="parsedOrders.length">
      <div
        v-for="(order, index) in parsedOrders"
        :key="index"
        style="margin-bottom: 1rem"
      >
        <!-- Panel for each order -->
        <Panel
          :header="`PO: ${order.customerPurchaseOrderNumber}`"
          style="margin-bottom: 1rem"
        >
          <!-- Basic order info -->
          <div class="p-mb-3">
            <strong>Order Status:</strong> {{ order.orderStatus }}
          </div>
  
          <!-- Line Items Table -->
          <h4>Line Items</h4>
          <DataTable :value="order.lineItems" responsiveLayout="scroll">
            <Column field="tiPartNumber" header="TI Part Number" />
            <Column field="customerLineItemNumber" header="Line Item #" />
            <Column field="status" header="Status" />
            <Column field="tiTotalOrderItemQuantity" header="Quantity" />
            <Column field="customerAnticipatedUnitPrice" header="Price" />
            <Column field="customerCurrencyCode" header="Currency" />
            
            <!-- Messages Column (Errors, Warnings, Info, etc.) -->
            <Column header="Messages">
                <template #body="slotProps">
                <!-- slotProps.data is the current row item -->
                <div v-if="slotProps.data.messages?.length">
                    <div 
                    v-for="(msg, i) in slotProps.data.messages" 
                    :key="i" 
                    style="margin-bottom: 1rem;"
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
  
    <Panel header="Order Details" v-else>
      <p>No Order Data</p>
    </Panel>
</template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  
  // PrimeVue Components
  import Panel from 'primevue/panel';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  const props = defineProps<{
    /**
     * Response array from your API call:
     * [
     *   {
     *     orders: [
     *       {
     *         customerPurchaseOrderNumber: "...",
     *         orderStatus: "...",
     *         lineItems: [ ... ]
     *       }
     *     ]
     *   }
     * ]
     */
    response: any[];
  }>();
  
  // Extract orders from the response in a safe way
  const parsedOrders = computed(() => {
    // Handle empty or invalid responses gracefully
    if (!props.response || !props.response.length) return [];
  
    // Typically, the first element in 'response' contains the 'orders' array
    const firstItem = props.response[0];
  
    // If there's an "orders" array, return it, otherwise return an empty array
    return (firstItem && firstItem.orders) ? firstItem.orders : [];
  });
  
  // Template for displaying lineItem messages
  function lineItemMessagesTemplate(lineItem: any) {
    if (!lineItem.messages || !lineItem.messages.length) {
      return 'No Messages';
    }
  
    return lineItem.messages.map((msg: any, i: number) => {
      return `
        <div key="${i}" style="margin-bottom: 1rem;">
          <strong>${msg.type}: ${msg.code}</strong><br />
          ${msg.reason}<br />
          ${msg.message}
        </div>
      `;
    }).join('');
  }
  </script>
  
  <style scoped>
  .p-mb-3 {
    margin-bottom: 1rem;
  }
  </style>
  