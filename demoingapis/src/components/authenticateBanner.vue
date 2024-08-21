<template>
    <Panel 
      header="TI Authorization" 
      toggleable 
      :collapsed="TIAuth" 
      :style="{ backgroundColor: TIAuth ? '#ccffcc' : '', width: 'calc(100vw - 300px)' }">
      <div class="flex flex-row gap-2 align-center">
            <div class="flex flex-row gap-2">
                <label for="username">Enter API Key: </label>
                <InputText id="username" v-model="TIapiKey"/>
            </div>
            <div class="flex flex-row gap-2">
                <label for="api-secret">Enter API Secret:</label>
                <Password id="api-secret" v-model="TIapiSecret" :feedback="false"/>
            </div>
            <Button label="Submit" @click="getTIAccessToken" />
            <p v-if="TIsuccessMessage" class="success-message">{{ TIsuccessMessage }}</p>
            <p v-if="TIerrorMessage" class="error-message">{{ TIerrorMessage }}</p>
        </div>
    </Panel>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Panel from 'primevue/panel';

const TIapiKey = ref('');
const TIapiSecret = ref('');
const TIsuccessMessage = ref('');
const TIerrorMessage = ref('');
const TIAuth = ref(true);

const store = useTIAccessTokenStore();

onMounted(() => {
  // Set TIAuth value from the store when the component loads
  TIAuth.value = store.TIAuth;
});

const getTIAccessToken = async () => {
  TIsuccessMessage.value = '';
  TIerrorMessage.value = '';
  try {
    const response = await axios.post('https://ring00y4pi.execute-api.us-east-2.amazonaws.com/testing/tiauth', {
      key: TIapiKey.value,
      secret: TIapiSecret.value
    });

    if (response.data.statusCode === 200) {
      store.setTIAccessToken(response.data.body.access_token);
      TIsuccessMessage.value = 'Authentication successful!';
      TIAuth.value = true;
      store.setTIAuth(true);  // Store the TIAuth value in the store
      setTimeout(getTIAccessToken, 60 * 60 * 1000); // Refresh token every 60 minutes
    } else {
      TIerrorMessage.value = 'Authentication failed. Please check your credentials.';
    }
  } catch (error) {
    console.error(error);
    TIerrorMessage.value = 'Authentication failed. Please check your credentials.';
  }
};
</script>
  <style scoped>
  .flex-row {
      display: flex;
      flex-direction: row;
      align-items: center;
  }
  
  .success-message {
    color: green;
    margin-top: 10px;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  