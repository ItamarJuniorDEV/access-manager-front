<template>
  <div class="register-page">
    <q-card class="register-card">
      <q-card-section class="text-center">
        <h4 class="text-h4 q-mb-md">Criar Conta</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined :rules="[val => !!val || 'Nome é obrigatório']" />

          <q-input v-model="form.email" label="Email" type="email" outlined :rules="[
            val => !!val || 'Email é obrigatório',
            val => /.+@.+\..+/.test(val) || 'Email inválido'
          ]" />

          <q-input v-model="form.password" label="Senha" :type="isPwd ? 'password' : 'text'" outlined
            :rules="[val => !!val || 'Senha é obrigatória']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <div class="full-width q-mt-md">
            <q-btn label="Registrar" type="submit" color="primary" class="full-width" :loading="loading" />
          </div>

          <div class="text-center q-mt-sm">
            <q-btn flat color="primary" label="Já tem uma conta? Faça login" @click="$router.push('/login')" />
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
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const authStore = useAuthStore()

    const loading = ref(false)
    const isPwd = ref(true)
    const form = ref({
      name: '',
      email: '',
      password: ''
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        console.log('Enviando dados de registro:', form.value)

        await authStore.register({
          name: form.value.name,
          email: form.value.email,
          password: form.value.password
        })

        $q.notify({
          type: 'positive',
          message: 'Conta criada com sucesso! Aguarde a aprovação do administrador.'
        })
        router.push('/login')
      } catch (error) {
        console.error('Erro no registro:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
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
.register-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.register-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>