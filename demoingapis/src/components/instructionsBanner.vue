<template>
    <Panel 
      :header="header" 
      toggleable 
      :collapsed="true"
      :style="{ width: 'calc(100vw - 300px)' }">
        <p class="m-0">
        {{ instruction }}
        </p>
    </Panel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Panel from 'primevue/panel';
import instructionData from '../assets/dynamicFiles/instructions.json';

interface InstructionData {
    header: string;
    instruction: string;
}

type InstructionKeys = keyof typeof instructionData;

// Props
const props = defineProps<{
    name: InstructionKeys;
}>();

// Reactive state
const header = ref<string>('');
const instruction = ref<string>('');

// Set the header and instruction based on the provided name
onMounted(() => {
    const data = instructionData[props.name];
    if (data) {
        header.value = data.header;
        instruction.value = data.instruction;
    } else {
        console.error('Specified name not found in the JSON data.');
    }
});
</script>
