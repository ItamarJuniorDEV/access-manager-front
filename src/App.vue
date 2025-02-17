<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary" v-if="isAuthenticated">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Sistema de Gestão de Acessos</q-toolbar-title>
        <q-btn flat round dense icon="dark_mode" @click="toggleDarkMode" />
        <q-btn flat dense round icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="isAuthenticated" v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/users" v-if="isAdmin">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Usuários</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/access">
          <q-item-section avatar>
            <q-icon name="key" />
          </q-item-section>
          <q-item-section>Acessos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/documents">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Documentos</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const authStore = useAuthStore()
    const leftDrawerOpen = ref(false)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const toggleDarkMode = () => {
      $q.dark.toggle()
      localStorage.setItem('darkMode', $q.dark.isActive)
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      $q.dark.set(savedDarkMode === 'true')
    }

    return {
      leftDrawerOpen,
      isAuthenticated,
      isAdmin,
      toggleLeftDrawer,
      toggleDarkMode,
      handleLogout
    }
  }
}
</script>