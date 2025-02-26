interface barDataItem {
  xAxis: [],
  yAxis: []
}
interface lineDataItem {
  xAxis: [],
  yAxis: []
}
interface TableVo {
   tableId:"",
   tableName:"",
   tableComment:"",
   columnList:[]
}

interface TalkVo {
   mode:"",
   columnList:[],
   dataList:[]
}

export { barDataItem, lineDataItem, TableVo, TalkVo}
