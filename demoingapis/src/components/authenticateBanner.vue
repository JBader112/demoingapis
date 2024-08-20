<template>
    <div class="auth-container">
      <div class="input-group">
        <label for="apiKey">API Key:</label>
        <input v-model="TIapiKey" id="apiKey" type="text" />
      </div>
      <div class="input-group">
        <label for="apiSecret">API Secret:</label>
        <input v-model="TIapiSecret" id="apiSecret" type="password" />
      </div>
      <button @click="getTIAccessToken">Authenticate</button>
      <p v-if="TIsuccessMessage" class="success-message">{{ TIsuccessMessage }}</p>
      <p v-if="TIerrorMessage" class="error-message">{{ TIerrorMessage }}</p>
    </div>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useTIAccessTokenStore } from '@/stores/TIAccessTokenStore';
  
  const TIapiKey = ref('');
  const TIapiSecret = ref('');
  const TIsuccessMessage = ref('');
  const TIerrorMessage = ref('');
  
  const store = useTIAccessTokenStore();
  
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
  .auth-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .input-group {
    margin-bottom: 10px;
    width: 100%;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .input-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  button:hover {
    background-color: #0056b3;
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
  