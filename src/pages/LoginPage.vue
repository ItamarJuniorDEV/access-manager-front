<template>
  <div class="login-page">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <h4 class="text-h4 q-mb-md">Login</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input v-model="form.email" label="Email" type="email" outlined
            :rules="[val => !!val || 'Email é obrigatório']" />

          <q-input v-model="form.password" label="Senha" :type="isPwd ? 'password' : 'text'" outlined
            :rules="[val => !!val || 'Senha é obrigatória']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <div class="full-width q-mt-md">
            <q-btn label="Entrar" type="submit" color="primary" class="full-width" :loading="loading" />
          </div>

          <div class="text-center q-mt-sm">
            <q-btn flat color="primary" label="Criar conta" @click="$router.push('/register')" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const authStore = useAuthStore()

    const loading = ref(false)
    const isPwd = ref(true)
    const form = ref({
      email: '',
      password: ''
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        console.log('Tentando login com:', form.value)

        await authStore.login(form.value)

        $q.notify({
          type: 'positive',
          message: 'Login realizado com sucesso!'
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Erro no login:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      isPwd,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>