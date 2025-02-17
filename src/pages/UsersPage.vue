<template>
  <div class="q-pa-md">
    <h5 class="q-mt-none q-mb-md">Gerenciamento de Usuários</h5>

    <q-table :rows="users" :columns="columns" row-key="id" :loading="loading">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="primary" icon="check_circle" @click="approveUser(props.row)"
            v-if="!props.row.active">
            <q-tooltip>Aprovar usuário</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="cancel" @click="rejectUser(props.row)" v-if="!props.row.active">
            <q-tooltip>Rejeitar usuário</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from '../services/api'

export default {
  name: 'UsersPage',
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const users = ref([])

    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Nome',
        align: 'left',
        field: row => row.name,
        sortable: true
      },
      {
        name: 'email',
        required: true,
        label: 'Email',
        align: 'left',
        field: row => row.email,
        sortable: true
      },
      {
        name: 'active',
        required: true,
        label: 'Status',
        align: 'left',
        field: row => row.active ? 'Ativo' : 'Pendente',
        sortable: true
      },
      {
        name: 'actions',
        required: true,
        label: 'Ações',
        align: 'center',
        field: row => row.id
      }
    ]

    const loadUsers = async () => {
      try {
        loading.value = true
        const { data } = await api.get('/users')
        users.value = data
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar usuários'
        })
      } finally {
        loading.value = false
      }
    }

    const approveUser = async (user) => {
      try {
        await api.post('/user/approved', {
          email: user.email,
          approved: true
        })
        $q.notify({
          type: 'positive',
          message: 'Usuário aprovado com sucesso!'
        })
        loadUsers()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao aprovar usuário'
        })
      }
    }

    const rejectUser = async (user) => {
      try {
        await api.post('/user/approved', {
          email: user.email,
          approved: false
        })
        $q.notify({
          type: 'positive',
          message: 'Usuário rejeitado com sucesso!'
        })
        loadUsers()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao rejeitar usuário'
        })
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      loading,
      users,
      columns,
      approveUser,
      rejectUser
    }
  }
}
</script>