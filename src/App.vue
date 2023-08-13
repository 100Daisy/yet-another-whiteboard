<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { userSessionStore } from './stores/userSessions';
import { ref } from 'vue'

const userSession = ref()
userSession.value = userSessionStore()
</script>

<template>
  <Sidebar v-if="userSession.session"/>
  <RouterView />
</template>