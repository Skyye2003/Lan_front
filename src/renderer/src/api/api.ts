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

//删除文件
export const deleteFile = (data: any) => {
  return service.post('/file/del', data)
}

//创建文件夹
export const createDir = (data: any) => {
  return service.post('/dir/create', data)
}
