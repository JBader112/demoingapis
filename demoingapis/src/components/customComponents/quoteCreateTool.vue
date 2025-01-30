<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Panel from 'primevue/panel';
import { defineEmits } from 'vue';

const emit = defineEmits(['submit']);

interface LineItem {
  tiPartNumber: string;
  quantity: number;
  requestedUnitPrice?: number;
  competitorName?: string;
  competitorPartNumber?: string;
  customerItemComments?: string;
  competitorUnitPrice?: number;
  competitorCurrencyCode?: string;
}

interface QuoteRequest {
  customerQuoteNumber?: string;
  quoteReason?: string;
  requestedUnitPriceCurrencyCode: string;
  contactName?: string;
  contactEmailAddress?: string;
  contactPhoneNumber?: string;
  endCustomerCompanyName?: string;
  checkoutProfileId: string;
  endCustomerWebsite?: string;
  lineItems: LineItem[];
}

const quoteReasonOptions = [
  { label: 'CM Controlled', value: 'CM' },
  { label: 'OEM Controlled', value: 'OE' },
  { label: 'New Opportunity', value: 'NO' },
  { label: 'Price Lookup', value: 'RE' }
];

const quoteRequest = ref<QuoteRequest>({
  requestedUnitPriceCurrencyCode: 'USD',
  checkoutProfileId: '',
  lineItems: []
});

const submitted = ref(false);
const editingRows = ref([]);

// Add new line item
const addLineItem = () => {
  quoteRequest.value.lineItems.push({
    tiPartNumber: '',
    quantity: 0
  });
};

// Remove line item
const removeLineItem = (index: number) => {
  quoteRequest.value.lineItems.splice(index, 1);
};

// Handle cell edit completion
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';

const onCellEditComplete = (event: DataTableCellEditCompleteEvent) => {
  const { data, newValue, field } = event;
  
  if (typeof field === 'string' && field in data) {
    (data as any)[field] = newValue;
  }
};

// Validate form
const isValid = computed(() => {
  const quote = quoteRequest.value;
  
  // Required fields
  if (!quote.checkoutProfileId || !quote.requestedUnitPriceCurrencyCode) {
    return false;
  }

  // Validate customerQuoteNumber if provided
  if (quote.customerQuoteNumber && 
      (quote.customerQuoteNumber.length < 1 || quote.customerQuoteNumber.length > 35)) {
    return false;
  }

  // Validate quoteReason if provided
  if (quote.quoteReason && quote.quoteReason.length > 2) {
    return false;
  }

  // Must have at least one line item
  if (quote.lineItems.length === 0) {
    return false;
  }

  // Validate each line item
  return quote.lineItems.every(item => {
    if (!item.tiPartNumber || item.tiPartNumber.length > 40 || 
        !item.quantity || item.quantity <= 0) {
      return false;
    }
    return true;
  });
});

// Handle form submission
const handleSubmit = () => {
  if (!isValid.value) {
    submitted.value = true;
    return;
  }
  
  const quoteData = {
    quote: quoteRequest.value
  };
  emit('submit', quoteData);
};
</script>

<template>
  <Panel header="Quote Request" toggleable :collapsed="false" :style="{ width: 'calc(100vw - 300px)' }">
    <div class="p-fluid">
      <!-- Quote Information -->
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="customerQuoteNumber">Customer Quote Number</label>
            <InputText
              id="customerQuoteNumber"
              v-model="quoteRequest.customerQuoteNumber"
              maxlength="35"
              placeholder="Enter quote number"
            />
          </div>
        </div>
        
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="quoteReason">Quote Reason</label>
            <Dropdown
              id="quoteReason"
              v-model="quoteRequest.quoteReason"
              :options="quoteReasonOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select reason"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="checkoutProfileId">Checkout Profile ID*</label>
            <InputText
              id="checkoutProfileId"
              v-model="quoteRequest.checkoutProfileId"
              :class="{ 'p-invalid': !quoteRequest.checkoutProfileId && submitted }"
              maxlength="32"
              placeholder="Enter Checkout Profile ID"
            />
            <small class="p-error" v-if="!quoteRequest.checkoutProfileId && submitted">
              Checkout Profile ID is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="currency">Currency Code*</label>
            <InputText
              id="currency"
              v-model="quoteRequest.requestedUnitPriceCurrencyCode"
              maxlength="5"
              placeholder="e.g., USD"
            />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="contactName">Contact Name</label>
            <InputText
              id="contactName"
              v-model="quoteRequest.contactName"
              maxlength="40"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="contactEmail">Contact Email</label>
            <InputText
              id="contactEmail"
              v-model="quoteRequest.contactEmailAddress"
              maxlength="75"
              type="email"
            />
          </div>
        </div>
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
          :value="quoteRequest.lineItems"
          editMode="cell"
          :scrollable="true"
          scrollHeight="400px"
          @cell-edit-complete="onCellEditComplete"
          class="p-datatable-sm"
        >
          <Column field="tiPartNumber" header="TI Part Number*" style="width: 150px">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" maxlength="40" />
            </template>
          </Column>

          <Column field="quantity" header="Quantity*" style="width: 120px">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                type="number"
                min="1"
              />
            </template>
          </Column>

          <Column field="requestedUnitPrice" header="Requested Unit Price" style="width: 150px">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                type="number"
                step="0.01"
                min="0"
              />
            </template>
          </Column>

          <Column field="competitorName" header="Competitor Name" style="width: 150px">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" maxlength="40" />
            </template>
          </Column>

          <Column field="competitorPartNumber" header="Competitor Part #" style="width: 150px">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" maxlength="40" />
            </template>
          </Column>

          <Column field="customerItemComments" header="Comments" style="width: 200px">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" maxlength="250" />
            </template>
          </Column>

          <Column field="competitorUnitPrice" header="Competitor Price" style="width: 150px">
            <template #editor="{ data, field }">
              <InputText
                v-model="data[field]"
                type="number"
                step="0.01"
                min="0"
              />
            </template>
          </Column>

          <Column field="competitorCurrencyCode" header="Competitor Currency" style="width: 120px">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" maxlength="5" placeholder="e.g., USD" />
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
          label="Submit Quote Request"
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

.grid {
  display: grid;
  gap: 1rem;
}

.col-12 {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .md\:col-6 {
    grid-column: span 6;
  }
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