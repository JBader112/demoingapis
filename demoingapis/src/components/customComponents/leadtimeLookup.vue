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
    <Button label="Submit" @click="submitInput" />
  </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';

// Reactive state
const inputText = ref<string>('');
const emit = defineEmits(['submit']);

// Emit the input text when submit is clicked
const submitInput = () => {
  emit('submit', inputText.value);
};
</script>
