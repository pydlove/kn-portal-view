const TestTableColumns = [
  {
    title: 'testName',
    dataIndex: 'testName',
    key: 'testName',
  },
  {
    title: 'createTime',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: 'updateTime',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: 'version',
    key: 'version',
  },
]
interface DataItem {
  testName: string
  createTime: string
  updateTime: string
  version: string
}

export { TestTableColumns, DataItem }
