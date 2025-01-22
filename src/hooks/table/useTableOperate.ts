/*
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-12-03 16:15:08
 * @LastEditTime: 2024-12-10 14:27:07
 * @FilePath: /cbdt-data-classification-categorization-front/src/hooks/table/useTableOperate.ts
 * @Description: file content
 */
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useBoolean } from '../useBoolean'
import type { TableRowSelection } from 'ant-design-vue/es/table/interface'
export function useTableOperate<T extends TableData = TableData>({
  data,
  getTableData
}: {
  data?: Ref<T[]>
  getTableData?: () => Promise<void>
}) {
  const { bool: modalOpen, setTrue: showModal, setFalse: hideModal } = useBoolean()

  const operateType = ref<AntDesign.TableOperateType>('add')

  function onAdd() {
    operateType.value = 'add'
    showModal()
  }

  /** the editing row data */
  const editingData: Ref<T | null> = ref(null)

  function onEdit(id: T['id']) {
    operateType.value = 'edit'
    const findItem = data.value.find((item) => item.id === id) || null
    editingData.value = findItem
    showModal()
  }

  /** the checked row keys of table */
  const selectedRowKeys: Ref<T['id'][]> = ref([])
  const selectedRows = ref<T[]>([])

  function onSelectChange(keys: (string | number)[], rows: T[]) {
    selectedRowKeys.value = keys as T['id'][]
    selectedRows.value = rows
  }

  const rowSelection = computed<TableRowSelection<T>>(() => {
    return {
      columnWidth: 48,
      type: 'checkbox',
      fixed: 'left',
      selectedRowKeys: selectedRowKeys.value,
      // Support select across pages
      preserveSelectedRowKeys: true,
      onChange: onSelectChange
    }
  })

  /** the hook after the batch delete operation is completed */
  async function onBatchDelete() {
    // window.$message?.success($t('common.deleteSuccess'))

    selectedRowKeys.value = []
    selectedRows.value = []

    if (getTableData) {
      await getTableData()
    } else {
      console.error('getTableData is not defined')
    }
  }

  /** the hook after the delete operation is completed */
  async function onDelete() {
    // window.$message?.success($t('common.deleteSuccess'))
    if (getTableData) {
      await getTableData()
    } else {
      console.error('getTableData is not defined')
    }
  }

  return {
    modalOpen,
    selectedRows,
    operateType,
    editingData,
    selectedRowKeys,
    rowSelection,
    showModal,
    hideModal,
    onAdd,
    onEdit,
    onSelectChange,
    onBatchDelete,
    onDelete
  }
}
