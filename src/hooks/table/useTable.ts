import { reactive, ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { useBoolean } from '../useBoolean'
import { useLoading } from '../useLoading'

export type MaybePromise<T> = T | Promise<T>

export type ApiFn = (args: any) => Promise<unknown>

export type TableColumnCheck = {
  key: string
  title: string
  checked: boolean
}

export type TableDataWithIndex<T> = T & { index: number }

export type TransformedData<T> = {
  tableData: TableDataWithIndex<T>[]
  page: number
  pageSize: number
  total: number
}

export type Transformer<T, Response> = (response: Response) => TransformedData<T>

export type TableConfig<A extends ApiFn, T> = {
  /** api function to get table data */
  apiFn: A
  /** api params */
  searchParams?: Parameters<A>[0]
  /** transform api response to table data */
  transformer?: Transformer<T, Awaited<ReturnType<A>>>
  /**
   * callback when response fetched
   *
   * @param transformed transformed data
   */
  onFetched?: (transformed: TransformedData<T>) => MaybePromise<void>
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean
  extraParams?: Partial<Parameters<A>[0]>
  defaultPagination?: TablePaginationConfig
}

export function useTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>) {
  const { loading, startLoading, endLoading } = useLoading()
  const { bool: empty, setBool: setEmpty } = useBoolean()

  const { apiFn, searchParams, transformer, immediate = true, extraParams, defaultPagination = {} } = config

  const searchData: NonNullable<Parameters<A>[0]> = reactive({ ...searchParams })
  const expertData: NonNullable<Parameters<A>[0]> = reactive({ ...extraParams })

  const tableData: Ref<TableDataWithIndex<T>[]> = ref([])

  const pagination: TablePaginationConfig = reactive({
    current: 1,
    pageSize: 15,
    showSizeChanger: true,
    pageSizeOptions: ['15', '50', '100'],
    total: 0,
    onChange: async (current: number, size: number) => {
      pagination.current = current
      pagination.pageSize = size
      getTableData()
    },
    ...defaultPagination
  })

  async function getTableData() {
    startLoading()
    const formattedParams = formatSearchParams({
      ...searchData,
      page: pagination.current,
      rows: pagination.pageSize,
      ...expertData
    })
    try {
      const response = await apiFn(formattedParams)

      const transformed = transformer ? transformer(response as Awaited<ReturnType<A>>) : response
      // handle over max page
      const maxPage = Math.ceil(transformed.total / pagination.pageSize!)
      if (transformed.total && pagination.current! > 1) {
        if (pagination.current! > maxPage) {
          pagination.current = maxPage
          nextTick(() => {
            getTableData()
          })
        }
      }
      tableData.value = transformed.rows
      pagination.total = transformed.total
      setEmpty(transformed.rows.length === 0)
      await config.onFetched?.(transformed)
    } catch (error) {
    } finally {
      endLoading()
    }
  }

  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value
      }
    })

    return formattedParams
  }

  /**
   * update search params
   *
   * @param params
   */
  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    Object.assign(searchData, params)
  }

  const onSearchTable = (params: Partial<Parameters<A>[0]>) => {
    Object.assign(searchData, params)
    pagination.current = 1
    getTableData()
  }
  /**
   * @description: Jump to the first page and refresh
   * @return {*}
   */
  const onFirstPageTableData = () => {
    pagination.current = 1
    getTableData()
  }
  /**
   * @description: Manually set table data to empty
   * @return {*}
   */
  const resetTableData = () => {
    tableData.value = []
    pagination.current = 1
    pagination.total = 0
  }
  /**
   * update pagination
   *
   * @param params
   */
  function updatePagination(params: Partial<Parameters<A>[0]>) {
    Object.assign(pagination, params)
  }

  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchData, searchParams)
  }

  if (immediate) {
    getTableData()
  }

  return {
    loading,
    empty,
    tableData,
    searchData,
    pagination,
    getTableData,
    updateSearchParams,
    resetSearchParams,
    updatePagination,
    onSearchTable,
    onFirstPageTableData,
    resetTableData
  }
}
