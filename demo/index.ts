import { HttpRequest } from "../dist/types";

const httpRequest = new HttpRequest({
  baseURL: "https://saberblog.topzhang.cn/",
  timeout: 5000,
  cancleRequests: [],
  handleCallback: {
    loadingStart: (config) => {},
    loadingEnd: () => {},
    responseErr: (err: any) => {},
  },
  interceptors: {
    requestInterceptor(config) {
      return config;
    },
    requestInterceptorCatch: (err) => {
      return Promise.reject(err);
    },
    responseInterceptor(res) {
      // 关闭表格加载动画
      return res;
    },
    responseInterceptorCatch(err) {
      return Promise.reject(err);
    },
  },
});

export default httpRequest;
