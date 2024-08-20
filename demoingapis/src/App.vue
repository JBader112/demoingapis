<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';

import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';


const router = useRouter();

const visible = ref(false);

const validationItems = ref([
  {
    label: 'TI Auth Status',
    icon: 'pi pi-home',
  },
  {
    label: 'Mouser Search Status',
    icon: 'pi pi-info',
  },
  {
    label: 'Mouser Order Status',
    icon: 'pi pi-briefcase',
  }
]);

const manuItems = ref([
  {
    label: 'Introduction',
    items:[
      {
          label: 'About',
          icon: 'pi pi-plus',
          command: () => router.push('/about')
      },
      {
          label: 'Contact',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      }
    ]
  },
  {
    label: 'Authenticate',
    items:[
      {
          label: 'Authenticate Keys',
          icon: 'pi pi-plus',
          command: () => router.push('/about')
      }
    ]
  },
  {
    label: 'TI Store Demos',
    items:[
      {
          label: 'Leadtime Lookup',
          icon: 'pi pi-plus',
          command: () => router.push('/leadtimeLookup')
      },
      {
          label: 'Part Information',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      }
    ]
  },
  {
    label: 'TI Backlog Demos',
    items:[
      {
          label: 'Quote Create API',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      },
      {
          label: 'Quote Retrieve API',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      },
      {
          label: 'Order Create & Change API',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      },
      {
          label: 'Order Retrieve',
          icon: 'pi pi-search',
          command: () => router.push('/about')
      },
    ]
  },
  {
    label: 'Multi-API Demos',
    items:[
      {
          label: 'Part Search',
          icon: 'pi pi-plus',
          command: () => router.push('/about')
      },
    ]
  }
]);

</script>

<template>
  <div class="flexbox-div">
    <div class="navbar-div">
      <div class="top-bar"></div>
      <Menubar :model="[]">
        <template #start>
          <img src="/logo.png" alt="" class="logo">
        </template>
        <template #end>
          <Menubar :model="validationItems" :pt="{
        root: { style: 'border: none' }
      }"/>
        </template>
      </Menubar>
      <div class="bottom-bar"></div>
    </div>
    <div class="main-dashboard">
    <div class="selector">
      <Menu :model="manuItems" class="custom-menu" :pt="{
        root: { style: 'width: 300px; height: calc(100vh - 150px);' }
      }">
      </Menu>
    </div>
    <div class="main-port">
      <RouterView />
    </div>
  </div>
  </div>
</template>

<style scoped>
 .logo {
  max-height: 100px;
  height: auto;
  width: auto;
}

.main-dashboard{
  display: flex;
}

.navbar-div {
  display: flex;
  flex-direction: column;
}

.flexbox-div {
  display: flex;
  flex-direction: column;
}

.top-bar, .bottom-bar {
  height: 5px;
  width: 100%;
  background-color: rgb(255, 0, 0);
  z-index: 100;
}

.navbar .nav-link {
  color: black !important;
}

</style>
