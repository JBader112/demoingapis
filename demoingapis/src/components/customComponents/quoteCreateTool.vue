<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Panel from 'primevue/panel';

const emit = defineEmits(['submit']);

interface LineItem {
  customerLineItemNumber: string;
  tiPartNumber: string;
  customerAnticipatedUnitPrice: number;
  quoteNumber: string;
  customerCurrencyCode: string;
  schedules: Array<{
    requestedQuantity: number;
    requestedDeliveryDate: string;
  }>;
}

const poNumber = ref('');
const checkoutProfileId = ref('');
const lineItems = ref<LineItem[]>([]);
const selectedItems = ref<LineItem[]>([]);

// Add new line item
const addLineItem = () => {
  lineItems.value.push({
    customerLineItemNumber: (lineItems.value.length + 1).toString(),
    tiPartNumber: '',
    customerAnticipatedUnitPrice: 0,
    quoteNumber: '',
    customerCurrencyCode: 'USD',
    schedules: [{
      requestedQuantity: 0,
      requestedDeliveryDate: ''
    }]
  });
};

// Remove line item
const removeLineItem = (index: number) => {
  lineItems.value.splice(index, 1);
  // Update line item numbers
  lineItems.value.forEach((item, idx) => {
    item.customerLineItemNumber = (idx + 1).toString();
  });
};

// Handle form submission
const handleSubmit = () => {
  const orderData = {
    order: {
      customerPurchaseOrderNumber: poNumber.value,
      checkoutProfileId: checkoutProfileId.value,
      lineItems: lineItems.value
    }
  };
  emit('submit', orderData);
};

const onCellEditComplete = (event: { data: LineItem; newValue: any; field: keyof LineItem | 'requestedQuantity' | 'requestedDeliveryDate' }) => {
  const { data, newValue, field } = event;
  const index = lineItems.value.findIndex(item => item === data);
  
  if (index !== -1) {
    // Handle nested schedule fields
    if (field === 'requestedQuantity' || field === 'requestedDeliveryDate') {
      (lineItems.value[index].schedules[0] as any)[field] = newValue;
    } else {
      (lineItems.value[index] as any)[field] = newValue;
    }
  }
};

// Validate form
const isValid = computed(() => {
  return poNumber.value &&
         checkoutProfileId.value &&
         lineItems.value.length > 0 &&
         lineItems.value.every(item => 
           item.tiPartNumber &&
           item.customerAnticipatedUnitPrice > 0 &&
           item.schedules.every(schedule => 
             schedule.requestedQuantity > 0 &&
             schedule.requestedDeliveryDate
           )
         );
});
</script>

<template>
  <Panel toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
    <div class="p-fluid grid">
      <div class="field col-12 md:col-6">
        <label for="poNumber">Purchase Order Number</label>
        <InputText id="poNumber" v-model="poNumber" />
      </div>
      <div class="field col-12 md:col-6">
        <label for="checkoutProfileId">Checkout Profile ID</label>
        <InputText id="checkoutProfileId" v-model="checkoutProfileId" />
      </div>
    </div>

    <DataTable 
      v-model:selection="selectedItems"
      :value="lineItems"
      editMode="cell"
      @cell-edit-complete="onCellEditComplete"
      class="p-datatable-sm"
      :showGridlines="true"
      tableStyle="min-width: 50rem"
    >
      <Column field="customerLineItemNumber" header="Line #" />
      <Column field="tiPartNumber" header="Part Number" :editor="true">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="customerAnticipatedUnitPrice" header="Unit Price" :editor="true">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" />
        </template>
      </Column>
      <Column field="schedules[0].requestedQuantity" header="Quantity" :editor="true">
        <template #body="{ data }">
          {{ data.schedules[0].requestedQuantity }}
        </template>
        <template #editor="{ data }">
          <InputText v-model="data.schedules[0].requestedQuantity" type="number" />
        </template>
      </Column>
      <Column field="schedules[0].requestedDeliveryDate" header="Delivery Date" :editor="true">
        <template #body="{ data }">
          {{ data.schedules[0].requestedDeliveryDate }}
        </template>
        <template #editor="{ data }">
          <Calendar v-model="data.schedules[0].requestedDeliveryDate" dateFormat="yy-mm-dd" />
        </template>
      </Column>
      <Column>
        <template #body="{ index }">
          <Button icon="pi pi-trash" @click="removeLineItem(index)" severity="danger" outlined />
        </template>
      </Column>
    </DataTable>

    <div class="mt-3 flex justify-between">
      <Button label="Add Line Item" icon="pi pi-plus" @click="addLineItem" />
      <Button 
        label="Submit" 
        icon="pi pi-check" 
        @click="handleSubmit" 
        :disabled="!isValid"
        severity="success"
      />
    </div>
  </Panel>
</template>

<style scoped>
.card {
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2);
}

.p-fluid .field {
  margin-bottom: 1rem;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.mt-3 {
  margin-top: 1rem;
}
</style>