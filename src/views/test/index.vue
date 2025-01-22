<template>

  <div class="ts-container">

    <a-card>

      <a-input-search
        addon-before="Wiwid"
        class="search-input"
        v-model:value="searchValue"
        placeholder="Please input wiwid"
        :loading="isSearchLoading"
        style="display: block"
        @search="getSearchList"
      />

      <a-table :columns="TestTableColumns"
               :data-source="dataSource"
               :loading="isLoading"
               :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a>编辑</a>
            <a-divider type="vertical"/>
            <a>删除</a>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineComponent, onMounted, ref} from 'vue';
import {getTestPage} from '@/api/test/test'
import {TestTableColumns, DataItem} from './index'

const searchValue = ref('')
const dataSource = ref<DataItem[]>([])
const isLoading = ref<boolean>(false)
const isSearchLoading = ref<boolean>(false)

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: (total: number) => `Total ${total} items`,
  onChange: (page: number, pageSize: number) => {
    fetchData(page, pageSize)
  }
})

const getSearchList = () => {
  isSearchLoading.value = true
  fetchData(1, 15)
}

const fetchData = async (current?: number, pageSize?: number) => {

  isLoading.value = true
  const res: { rows: DataItem[]; total: number } = await getTestPage({
    name: searchValue.value,
    page: current || pagination.value.current,
    rows: pageSize || pagination.value.pageSize
  })
  console.log(res)

  isLoading.value = false
  isSearchLoading.value = false
  pagination.value.total = res.total
  current && (pagination.value.current = current)
  pageSize && (pagination.value.pageSize = pageSize)
  dataSource.value = Array.isArray(res.rows) ? res.rows : []
}

onMounted(() => {
  fetchData()
});
</script>

<style scoped>
.ts-container {
  padding: 16px;
}
.search-input {
  min-width: 100px;
  max-width: 300px;
  margin-bottom: 20px;
}
</style>
