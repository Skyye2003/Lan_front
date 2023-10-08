import axios, {AxiosInstance, AxiosError} from 'axios';


// 创建 axios 实例
const service:AxiosInstance = axios.create({
  baseURL:"/proxy",
  timeout: 5000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});

service.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: any) => {
    if (response.status === 200) {
      console.log(response)
      return response;
    } else {

      Promise.reject();
    }
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
