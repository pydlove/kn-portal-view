interface UserAddDataItem {
  userPwd: string;
  userName: string;
  roleId: number;
  tableIds: number[];
}


interface UserDataItem {
  id: number;
  userName: string;
  roleId: number;
  roleName: string;
  tableNames: string;
  createTime: string;
  updateTime: string;
}

const UserColumns = [
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '授权表名',
    dataIndex: 'tableNames',
    key: 'tableNames',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

export { UserColumns, UserDataItem, UserAddDataItem }
