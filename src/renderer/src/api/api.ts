import qs from 'qs'
import service from "../utils/request";

//获取登记项列表
export const getItemList = (query: any) => {
  return service.get('/dir/list?' + qs.stringify(query))
}
