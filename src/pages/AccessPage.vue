<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Conceder Acesso</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleGrantAccess" class="q-gutter-md">
              <q-select v-model="grantForm.user_id" :options="users" option-label="name" option-value="id"
                label="Usuário" outlined emit-value map-options :rules="[val => !!val || 'Selecione um usuário']" />

              <q-select v-model="grantForm.feature" :options="features" option-label="label" option-value="value"
                label="Recurso" outlined emit-value map-options :rules="[val => !!val || 'Selecione um recurso']" />

              <q-input v-model="grantForm.final_date" label="Data de Expiração" outlined type="datetime-local"
                :rules="[val => !!val || 'Defina uma data de expiração']" />

              <q-btn label="Conceder Acesso" type="submit" color="primary" :loading="loading" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acessos Ativos</div>
          </q-card-section>

          <q-card-section>
            <q-list separator>
              <q-item v-for="access in activeAccess" :key="access.id">
                <q-item-section>
                  <q-item-label>{{ getUserName(access.user_id) }}</q-item-label>
                  <q-item-label caption>
                    {{ getFeatureName(access.feature) }} -
                    Expira em: {{ formatDate(access.final_date) }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn flat round color="negative" icon="cancel" @click="revokeAccess(access)">
                    <q-tooltip>Revogar acesso</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import moment from 'moment'
import api from '../services/api'

export default {
  name: 'AccessPage',
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const users = ref([])
    const activeAccess = ref([])

    const features = [
      { label: 'Documentos', value: 0 },
      { label: 'Área Restrita', value: 1 },
      { label: 'Sistema Interno', value: 2 }
    ]

    const grantForm = ref({
      user_id: null,
      feature: null,
      final_date: null
    })

    const loadUsers = async () => {
      try {
        const { data } = await api.get('/users')
        users.value = data.filter(user => user.active)
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar usuários'
        })
      }
    }

    const loadAccess = async () => {
      try {
        const { data } = await api.get('/manageAccess')
        activeAccess.value = data.filter(access => !access.revoked)
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar acessos'
        })
      }
    }

    const handleGrantAccess = async () => {
      try {
        loading.value = true
        await api.post('/manageAccess', grantForm.value)
        $q.notify({
          type: 'positive',
          message: 'Acesso concedido com sucesso!'
        })
        loadAccess()
        grantForm.value = {
          user_id: null,
          feature: null,
          final_date: null
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao conceder acesso'
        })
      } finally {
        loading.value = false
      }
    }

    const revokeAccess = async (access) => {
      try {
        await api.post('/manageAccess/revoked', {
          feature: access.feature,
          user_id: access.user_id
        })
        $q.notify({
          type: 'positive',
          message: 'Acesso revogado com sucesso!'
        })
        loadAccess()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao revogar acesso'
        })
      }
    }

    const getUserName = (userId) => {
      const user = users.value.find(u => u.id === userId)
      return user ? user.name : 'Usuário não encontrado'
    }

    const getFeatureName = (featureId) => {
      const feature = features.find(f => f.value === featureId)
      return feature ? feature.label : 'Recurso não encontrado'
    }

    const formatDate = (date) => {
      return moment(date).format('DD/MM/YYYY HH:mm')
    }

    onMounted(() => {
      loadUsers()
      loadAccess()
    })

    return {
      loading,
      users,
      features,
      activeAccess,
      grantForm,
      handleGrantAccess,
      revokeAccess,
      getUserName,
      getFeatureName,
      formatDate
    }
  }
}
</script>