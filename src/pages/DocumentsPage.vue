<template>
  <div class="q-pa-md">
    <h5 class="q-mt-none q-mb-md">Documentos</h5>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4" v-for="doc in documents" :key="doc.id">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ doc.title }}</div>
            <div class="text-subtitle2">{{ doc.description }}</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Visualizar" @click="viewDocument(doc)" />
            <q-btn flat color="primary" label="Download" @click="downloadDocument(doc)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Placeholder para quando não houver documentos -->
    <div v-if="documents.length === 0" class="text-center q-pa-md">
      <q-icon name="description" size="50px" color="grey-5" />
      <p class="text-grey-6">Nenhum documento disponível</p>
    </div>

    <!-- Dialog para visualização do documento -->
    <q-dialog v-model="showViewDialog" full-width>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ selectedDocument?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="document-viewer">
            <iframe v-if="selectedDocument?.type === 'pdf'" :src="selectedDocument?.url"
              style="width: 100%; height: 600px" frameborder="0"></iframe>
            <img v-else-if="selectedDocument?.type === 'image'" :src="selectedDocument?.url" style="max-width: 100%" />
            <div v-else class="text-center">
              Visualização não disponível para este tipo de documento
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from '../services/api'

export default {
  name: 'DocumentsPage',
  setup() {
    const $q = useQuasar()
    const documents = ref([
      {
        id: 1,
        title: 'Manual do Usuário',
        description: 'Guia completo de utilização do sistema',
        type: 'pdf',
        url: '#'
      },
      {
        id: 2,
        title: 'Política de Segurança',
        description: 'Normas e procedimentos de segurança',
        type: 'pdf',
        url: '#'
      },
      {
        id: 3,
        title: 'Termos de Uso',
        description: 'Termos e condições de uso do sistema',
        type: 'pdf',
        url: '#'
      }
    ])
    const showViewDialog = ref(false)
    const selectedDocument = ref(null)

    const checkAccess = async () => {
      try {
        await api.get('/documents')
        return true
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Você não tem acesso aos documentos'
        })
        return false
      }
    }

    const viewDocument = async (doc) => {
      if (await checkAccess()) {
        selectedDocument.value = doc
        showViewDialog.value = true
      }
    }

    const downloadDocument = async (doc) => {
      if (await checkAccess()) {
        $q.notify({
          type: 'info',
          message: `Baixando: ${doc.title}`
        })
      }
    }

    onMounted(async () => {
      await checkAccess()
    })

    return {
      documents,
      showViewDialog,
      selectedDocument,
      viewDocument,
      downloadDocument
    }
  }
}
</script>