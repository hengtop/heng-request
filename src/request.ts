/* 
   封装一个通用的axios
   实现功能
   - 简介的调用请求方式
   - 支持请求响应拦截，分多个粒度进行拦截，氛围每个实例生效，当前实例生效，当前请求生效
   - 支持请求取消
   - 错误处理
   - 拦截器中实现动画，返回结果实现提示
   - 理清拦截器执行顺序

*/

import axios from "axios";

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  HttpInterceptor,
  HttpRequestConfig,
  CancelRequestSource,
} from "./types";

export default class HttpRequest {
  instance: AxiosInstance;
  interceptors?: HttpInterceptor;
  showLoading?: boolean;
  showResponseMessage?: boolean;
  cancleRequests?: CancelRequestSource[];
  handleCallback?: {
    loadingStart?: (config?: AxiosRequestConfig) => void;
    loadingEnd?: (config?: AxiosRequestConfig) => void;
    response?: (res?: AxiosResponse) => void;
    responseErr?: (res?: AxiosResponse) => void;
  };
  loadingCount = 0;
  private DEFAULT_LOADING = true;
  private DEFAULT_MESSAGE = true;

  constructor(config: HttpRequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    this.showLoading = config.showLoading ?? this.DEFAULT_LOADING;
    this.showResponseMessage =
      config.showResponseMessage ?? this.DEFAULT_MESSAGE;
    this.cancleRequests = config.cancleRequests;
    this.handleCallback = config.handleCallback;
    //配置单个实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
    //配置所有实例使用的拦截器
    this.instance.interceptors.request.use(
      (config: HttpRequestConfig) => {
        if (config.showLoading ?? this.showLoading) {
          this.loadingCount++;
          this.handleCallback?.loadingStart?.();
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  request<T>(config: HttpRequestConfig<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      const url = config.url;
      if (url) {
        config.cancelToken = new axios.CancelToken((c) => {
          this.cancleRequests?.push({
            [url]: c,
          });
        });
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          if (config.showResponseMessage ?? this.showResponseMessage) {
            this.handleCallback?.response?.();
          }
          if (
            (config.showLoading ?? this.showLoading) &&
            --this.loadingCount === 0
          ) {
            this.handleCallback?.loadingEnd?.();
          }

          resolve(res);
        })
        .catch((err) => {
          if (config.showResponseMessage ?? this.showResponseMessage) {
            this.handleCallback?.responseErr?.(err);
          }
          if (
            (config.showLoading ?? this.showLoading) &&
            --this.loadingCount === 0
          ) {
            this.handleCallback?.loadingEnd?.();
          }

          reject(err);
        })
        .finally(() => {
          url && this.deleteUrl(url);
        });
    });
  }
  private getRequestIndex(url: string) {
    return this.cancleRequests?.findIndex(
      (item) => Object.keys(item)[0] === url
    ) as number;
  }
  private deleteUrl(url: string) {
    const index = this.getRequestIndex(url);
    index !== -1 && this.cancleRequests?.splice(index as number, 1);
  }
  cancelAllRequest() {
    this.cancleRequests?.forEach((item) => {
      const key = Object.keys(item)[0];
      item[key]();
    });
  }
  cancelRequest(url: string | string[]) {
    if (typeof url === "string") {
      const index = this.getRequestIndex(url);
      index !== -1 && this.cancleRequests?.[index][url]();
    } else {
      url.forEach((item) => {
        const index = this.getRequestIndex(item);
        index !== -1 && this.cancleRequests?.[index][item]();
      });
    }
  }
}
