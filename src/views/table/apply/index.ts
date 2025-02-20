const applyTableColumns = [
  {
    title: '申请单号',
    dataIndex: 'applyNo',
    key: 'testName',
  },
  {
    title: '申请人',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '申请访问表',
    dataIndex: 'tableName',
    key: 'tableName',
  },
  {
    title: '申请用途',
    dataIndex: 'purpose',
    key: 'purpose',
  },
  {
    title: '申请原因 ',
    dataIndex: 'applyReason',
    key: 'applyReason',
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '审批状态',
    dataIndex: 'chApplyStatus',
    key: 'applyStatus',
  },
  // {
  //   title: '审批备注',
  //   dataIndex: 'applyResult',
  //   key: 'applyResult',
  // },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150
  }
]
interface DataItem {
  id: number
  applyNo: string
  userId: number
  username: string
  tableName: string
  purpose: string
  applyReason: string
  createTime: string
  isChecked: boolean
}

export { applyTableColumns, DataItem }
