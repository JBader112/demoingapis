<template>
    <Panel 
      header='Leadtime Lookup' 
      toggleable 
      :collapsed="false"
      :style="{ width: 'calc(100vw - 300px)' }">
      <FloatLabel :style="{ marginTop: '20px' }">
        <label>Enter Part Numbers separated by commas or new lines</label>
        <Textarea :style="{ width: 'calc(100vw - 350px)' }" v-model="inputText" rows="5" cols="30" />
      </FloatLabel>
      <Button label="Submit" @click="fetchProductData"/>
      <div v-if="products.length > 0" style="margin-top: 20px;">
        <h3>Product Information:</h3>
        <ul>
          <li v-for="product in products" :key="product.Identifier">
            {{ product.Product.Identifier }}: {{ product.Product.LeadTimeWeeks }}
          </li>
        </ul>
      </div>
    </Panel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import axios from 'axios';
import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';

const store = useTIAccessTokenStore();
const accesstoken = ref('');

// Reactive state
const inputText = ref<string>('');
const products = ref<Array<any>>([]); // To store product information

// Fetch product data based on input
async function fetchProductData() {
    const identifiers = inputText.value.split(/[\n,]+/).map(s => s.trim());
    const filteredIdentifiers = identifiers.filter(identifier => identifier.trim() !== '');

    try {
        products.value = []; // Reset products array

        // Loop through each identifier and fetch the product data
        for (const identifier of filteredIdentifiers) {
            const response = await axios.get(`https://transact.ti.com/v1/products-extended/${identifier}`, {
                headers: {
                    Authorization: `Bearer ${accesstoken.value}`,
                },
            });

            // Push each product's data into the products array
            products.value.push(response.data);
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Set the access token on component mount
onMounted(() => {
    accesstoken.value = store.accessToken;
});
</script>
