//hook：以函数形式抽离一些可复用的方法像钩子一样挂着，随时可以引入和调用，实现高内聚低耦合的目标
export interface IHookOptions {
  //是否在创建页面时，调用数据列表接口
  createdIsNeed?: boolean
  //数据获取时是否加载
  dataListLoading?: boolean
  //是否需要分页
  isPage?: boolean
  //HTTP methods
  method?: string
  //数据表格
  tableData?: any[]
  //后端列表list名
  tableName?: string
  //查询表格数据用url
  dataListUrl?: string
  //删除用url
  deleteUrl?: string
  //查询条件
  queryForm?: any
  //自定义数据名
  CustomDataName?: string[]
  //自定义数据
  CustomData?: any
  //当前页码
  page?: number
  //每页条数
  row?: number
  //总页数
  total?: number
}
