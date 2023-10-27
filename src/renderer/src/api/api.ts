import qs from 'qs'
import service from "../utils/request";

//获取登记项列表
export const getItemList = (query: any) => {
  return service.get('/dir/list?' + qs.stringify(query))
}

//创建文件
export const createFile = (data: any) => {
  return service.post('/file/create', data)
}

//打开文件
export const openFile = (data: any) => {
  return service.post('/file/open', data)
}

//追加写文件
export const appendFile = (data: any) => {
  return service.post('/file/write', data)
}

//更改文件属性
export const changeFileAttr = (data: any) => {
  return service.post('/file/change', data)
}

//删除文件
export const deleteFile = (data: any) => {
  return service.post('/file/del', data)
}

//创建文件夹
export const createDir = (data: any) => {
  return service.post('/dir/create', data)
}
