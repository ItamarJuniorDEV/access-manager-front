<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acessos Ativos</div>
            <div class="text-h4">{{ activeAccessCount }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acessos Expirando</div>
            <div class="text-h4">{{ expiringAccessCount }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Usuários Pendentes</div>
            <div class="text-h4">{{ pendingUsersCount }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acessos Recentes</div>
          </q-card-section>

          <q-card-section>
            <q-table :rows="recentAccess" :columns="columns" row-key="id" :loading="loading" flat bordered />
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
  name: 'DashboardPage',
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const activeAccessCount = ref(0)
    const expiringAccessCount = ref(0)
    const pendingUsersCount = ref(0)
    const recentAccess = ref([])

    const columns = [
      {
        name: 'user',
        required: true,
        label: 'Usuário',
        align: 'left',
        field: row => row.userName
      },
      {
        name: 'feature',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: row => row.featureName
      },
      {
        name: 'initialDate',
        required: true,
        label: 'Data Inicial',
        align: 'left',
        field: row => moment(row.initial_date).format('DD/MM/YYYY HH:mm')
      },
      {
        name: 'finalDate',
        required: true,
        label: 'Data Final',
        align: 'left',
        field: row => moment(row.final_date).format('DD/MM/YYYY HH:mm')
      },
      {
        name: 'status',
        required: true,
        label: 'Status',
        align: 'left',
        field: row => row.status
      }
    ]

    const loadDashboardData = async () => {
      try {
        loading.value = true
        const [accessResponse, usersResponse] = await Promise.all([
          api.get('/manageAccess'),
          api.get('/users')
        ])

        const now = moment()
        const access = accessResponse.data
        const users = usersResponse.data

        activeAccessCount.value = access.filter(a => !a.revoked && moment(a.final_date).isAfter(now)).length
        expiringAccessCount.value = access.filter(a => !a.revoked &&
          moment(a.final_date).isAfter(now) &&
          moment(a.final_date).diff(now, 'hours') < 24
        ).length
        pendingUsersCount.value = users.filter(u => !u.active).length

        recentAccess.value = access
          .slice(0, 10)
          .map(a => ({
            ...a,
            userName: users.find(u => u.id === a.user_id)?.name || 'Usuário não encontrado',
            featureName: getFeatureName(a.feature),
            status: getAccessStatus(a)
          }))
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar dados do dashboard'
        })
      } finally {
        loading.value = false
      }
    }

    const getFeatureName = (featureId) => {
      const features = {
        0: 'Documentos',
        1: 'Área Restrita',
        2: 'Sistema Interno'
      }
      return features[featureId] || 'Desconhecido'
    }

    const getAccessStatus = (access) => {
      if (access.revoked) return 'Revogado'
      if (moment(access.final_date).isBefore(moment())) return 'Expirado'
      if (moment(access.final_date).diff(moment(), 'hours') < 24) return 'Expirando'
      return 'Ativo'
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      loading,
      activeAccessCount,
      expiringAccessCount,
      pendingUsersCount,
      recentAccess,
      columns
    }
  }
}
</script>