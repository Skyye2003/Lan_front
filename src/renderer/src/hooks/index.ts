import {IHookOptions} from "./interface";
import {onMounted} from "vue";
import service from "../utils/request";
import {ElMessage, ElMessageBox} from "element-plus";


/**
 * 自定义钩子函数
 * @param options
 */
export const useCrud = (options: IHookOptions) => {
  //初始化每个options
  const defaultOptions: IHookOptions = {
    createdIsNeed: true,
    dataListLoading: false,
    isPage:false,
    tableData: [],
    CustomDataName: [],
    dataListUrl: '',
    deleteUrl: '',
    queryForm: {},
    CustomData: {},
    page: 1,
    row: 10,
    total: 0,
  }

  //覆盖默认值
  const mergeDefaultOptions = (options: any, props: any):IHookOptions => {
    for (const key in options) {
      //如果使用该钩子的组件所用的属性默认属性中不存在，则将该属性值覆盖默认属性值
      if(!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  const state = mergeDefaultOptions(defaultOptions, options)

  //初始化组件的时候如果需要加载表格数据
  onMounted(() => {
    if(state.createdIsNeed) {
      query()
    }
  })

  //向后端获取数据
  const query = () => {
    //如果表格数据的url不存在，则直接退出
    if(!state.dataListUrl) {
      return
    }
    //获取数据中开始加载
    state.dataListLoading = true
    console.debug(state.queryForm)

    //需要发送的请求列表
    service
      .post(state.dataListUrl, {
          ...state.queryForm
      }).then((res: any) => {
      state.tableData = res.data.data
      console.debug(state.tableData)


    }).finally(() => {
      //数据查询完毕，停止加载
      state.dataListLoading = false
    })

  }

  //获取数据列表
  const getDataList = () => {
    query()
  }

  //页面大小变化
  const sizeChangeHandle = (val: number) => {
    console.log('size change to ' + val)
    state.page = 0
    state.row = val
    query()
  }

  //页码变化(因为后端页码数据是从0开始，所以必须进行处理)
  const pageChangeHandle = (val: number) => {
    console.log('page change to ' + val)
    state.page = val - 1
    query()
  }

  //删除操作
  const deleteHandle = (key: number | string) => {
    //删除url不存在，直接返回
    if (!state.deleteUrl) {
      return
    }

    ElMessageBox.confirm("是否进行删除操作？", '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      service.post(state.deleteUrl!, {
        params: {
          id: key
        }
      }).then((res: any) => {
        if (res.data.result == true) {
          ElMessage.success("删除成功！")
          query()
        }
        else {
          ElMessage.error(res.data.reason)
        }
      }).catch(() => {})
    })
  }

  const sortChangeHandle = (column: any) => {
    console.log(column.order)
    console.log(column.prop)
  }

  return {
    getDataList,
    sizeChangeHandle,
    pageChangeHandle,
    deleteHandle,
    sortChangeHandle
  }
}
