<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Panel from 'primevue/panel';
import { defineEmits } from 'vue';

const emit = defineEmits(['submit']);

interface Schedule {
  requestedQuantity: number;
  requestedDeliveryDate: string;
}

interface LineItem {
  customerLineItemNumber: string; // required
  tiPartNumber: string;           // required
  customerAnticipatedUnitPrice: number; // required
  quoteNumber?: string;           // optional
  customerPartNumber?: string;    // optional
  customerCurrencyCode: string;
  schedules: Schedule[];          // at least one schedule required
}

const poNumber = ref('');
const checkoutProfileId = ref('');
const lineItems = ref<LineItem[]>([]);
  const submitted = ref(false);
  const editingRows = ref([]);
  const editingScheduleRows = ref([]); // Add this new ref for schedule editing

// Add new line item
const addLineItem = () => {
  lineItems.value.push({
    // You can make this generated or user-editable. 
    // For demonstration, we'll keep it auto-generated.
    customerLineItemNumber: (lineItems.value.length + 1).toString(),
    tiPartNumber: '',
    customerAnticipatedUnitPrice: 0,
    quoteNumber: '',
    customerPartNumber: '',
    customerCurrencyCode: 'USD',
    schedules: [
      {
        requestedQuantity: 0,
        requestedDeliveryDate: ''
      }
    ]
  });
};

const formatDate = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const onScheduleCellEditComplete = (event: {
  data: Schedule;
  newValue: any;
  field: keyof Schedule;
}, lineItemIndex: number) => {
  const { data, newValue, field } = event;
  const scheduleIndex = lineItems.value[lineItemIndex].schedules.findIndex(schedule => schedule === data);
  if (scheduleIndex !== -1) {
    if (field === 'requestedDeliveryDate' && newValue) {
      // Format the date before storing
      lineItems.value[lineItemIndex].schedules[scheduleIndex][field] = formatDate(newValue);
    } else {
      (lineItems.value[lineItemIndex].schedules[scheduleIndex][field] as any) = newValue;
    }
  }
};

// Remove entire line item
const removeLineItem = (index: number) => {
  lineItems.value.splice(index, 1);
  // Reassign line item numbers in case you want them sequential
  lineItems.value.forEach((item, idx) => {
    item.customerLineItemNumber = (idx + 1).toString();
  });
};

// Add schedule to a specific line item
const addSchedule = (lineItemIndex: number) => {
  lineItems.value[lineItemIndex].schedules.push({
    requestedQuantity: 0,
    requestedDeliveryDate: ''
  });
};

// Remove schedule from a specific line item
const removeSchedule = (lineItemIndex: number, scheduleIndex: number) => {
  lineItems.value[lineItemIndex].schedules.splice(scheduleIndex, 1);
};

// Handle cell edit completion for line items
const onCellEditComplete = (event: {
  data: LineItem;
  newValue: any;
  field: keyof LineItem;
}) => {
  const { data, newValue, field } = event;
  const index = lineItems.value.findIndex(item => item === data);
  if (index !== -1) {
    (lineItems.value[index] as any)[field] = newValue;
  }
};

// If you want to do cell editing for schedules as well,
// you can create a similar function, e.g. onScheduleCellEditComplete.

// Validate entire form
const isValid = computed(() => {
  // Basic check for top-level fields
  if (!poNumber.value || !checkoutProfileId.value) {
    return false;
  }

  // Must have at least one line item
  if (lineItems.value.length === 0) {
    return false;
  }

  // Validate each line item
  for (const item of lineItems.value) {
    // Required fields
    if (!item.tiPartNumber || item.customerAnticipatedUnitPrice <= 0) {
      return false;
    }

    // Must have at least one schedule
    if (item.schedules.length === 0) {
      return false;
    }

    // Validate each schedule
    for (const sched of item.schedules) {
      if (sched.requestedQuantity <= 0 || !sched.requestedDeliveryDate) {
        return false;
      }
    }
  }

  // Optional fields (quoteNumber, customerPartNumber) have no requirement
  return true;
});

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
</script>

<template>
  <Panel header="Line Items" toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
  <div class="p-fluid">
    <!-- Top-level form fields -->
    <div class="field">
      <label for="poNumber">PO Number*</label>
      <InputText
        id="poNumber"
        v-model="poNumber"
        :class="{ 'p-invalid': !poNumber && submitted }"
        placeholder="Enter PO Number"
      />
      <small class="p-error" v-if="!poNumber && submitted">PO Number is required</small>
    </div>

    <div class="field">
      <label for="checkoutProfileId">Checkout Profile ID*</label>
      <InputText
        id="checkoutProfileId"
        v-model="checkoutProfileId"
        :class="{ 'p-invalid': !checkoutProfileId && submitted }"
        placeholder="Enter Checkout Profile ID"
      />
      <small class="p-error" v-if="!checkoutProfileId && submitted">
        Checkout Profile ID is required
      </small>
    </div>

    <!-- Line Items Section -->
    <Panel header="Line Items" class="mt-3">
      <div class="flex justify-between mb-3">
        <h3>Line Items</h3>
        <Button
          label="Add Line Item"
          icon="pi pi-plus"
          @click="addLineItem"
          severity="secondary"
        />
      </div>

      <DataTable
        v-model:editingRows="editingRows"
        :value="lineItems"
        editMode="cell"
        :scrollable="true"
        scrollHeight="400px"
        @cell-edit-complete="onCellEditComplete"
        class="p-datatable-sm"
      >
        <Column field="customerLineItemNumber" header="Line #" style="width: 80px">
          <template #body="{ data, index }">
            {{ index + 1 }}
          </template>
        </Column>

        <Column field="tiPartNumber" header="TI Part Number*" style="width: 150px">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>

        <Column field="customerPartNumber" header="Customer Part Number" style="width: 150px">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>

        <Column
          field="customerAnticipatedUnitPrice"
          header="Unit Price*"
          style="width: 120px"
        >
          <template #editor="{ data, field }">
            <InputText
              v-model="data[field]"
              type="number"
              step="0.01"
              min="0"
            />
          </template>
        </Column>

        <Column field="quoteNumber" header="Quote Number" style="width: 120px">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>

        <Column field="customerCurrencyCode" header="Currency*" style="width: 100px">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>

        <!-- Schedules SubTable -->
        <Column header="Schedules" style="width: 400px">
    <template #body="{ data, index }">
      <DataTable 
        :value="data.schedules" 
        class="p-datatable-sm"
        editMode="cell"
        v-model:editingRows="editingScheduleRows"
        @cell-edit-complete="(e) => onScheduleCellEditComplete(e, index)"
      >
        <Column field="requestedQuantity" header="Quantity*">
          <template #body="{ data }">
            {{ data.requestedQuantity }}
          </template>
          <template #editor="{ data }">
            <InputText
              v-model="data.requestedQuantity"
              type="number"
              min="1"
            />
          </template>
        </Column>

        <Column field="requestedDeliveryDate" header="Delivery Date*">
          <template #body="{ data }">
            {{ data.requestedDeliveryDate }}
          </template>
          <template #editor="{ data }">
            <Calendar
              v-model="data.requestedDeliveryDate"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              :manualInput="false"
              :showTime="false"
              :showButtonBar="false"
            />
          </template>
        </Column>
            </DataTable>

            <div class="flex justify-content-end mt-2">
              <Button
                label="Add Schedule"
                icon="pi pi-plus"
                @click="addSchedule(index)"
                severity="secondary"
                text
              />
            </div>
          </template>
        </Column>

        <Column style="width: 80px">
          <template #body="{ index }">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="removeLineItem(index)"
            />
          </template>
        </Column>
      </DataTable>
    </Panel>

    <!-- Submit Button -->
    <div class="flex justify-content-end mt-3">
      <Button
        label="Submit Order"
        icon="pi pi-check"
        @click="handleSubmit"
        :disabled="!isValid"
      />
    </div>
  </div>
</Panel>
</template>

<style scoped>
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

.mb-3 {
  margin-bottom: 1rem;
}

.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.5rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}

:deep(.p-datatable-wrapper) {
  overflow: visible;
}
</style>