import type { AxiosRequestConfig, AxiosResponse } from "axios";
export interface HttpInterceptor<T = AxiosResponse> {
    /**
     * 请求成功拦截器
     */
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    /**
     * 请求失败拦截器
     */
    requestInterceptorCatch?: (err: any) => any;
    /**
     * 响应成功拦截器
     */
    responseInterceptor?: (res: T) => T;
    /**
     * 响应失败拦截器
     */
    responseInterceptorCatch?: (err: any) => any;
}
export interface HttpRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    /**
     * 拦截器设置
     */
    interceptors?: HttpInterceptor<T>;
    /**
     * 是否执行请求加载动画回调函数，需要通过handleCallback配置动画加载的回调函数。
     * 另外单个请求中配置了该属性，就会以单个请求中的为准，实例中配置该属性视为默认属性
     */
    showLoading?: boolean;
    /**
     * 和showLoading一样
     */
    showResponseMessage?: boolean;
    /**
     * 保存取消请求的数组
     */
    cancleRequests?: CancelRequestSource[];
    /**
     * 配置请求拦截器中的一些回调函数
     */
    handleCallback?: {
        /**
         * 请求开始的加载动画配置
         */
        loadingStart?: (config?: AxiosRequestConfig) => void;
        /**
         * 请求结束后的加载动画配置
         */
        loadingEnd?: (config?: AxiosRequestConfig) => void;
        /**
         * 成功响应后的消息设置
         */
        response?: (res?: AxiosResponse) => void;
        /**
         * 失败相应后的消息配置
         */
        responseErr?: (err?: AxiosResponse) => void;
    };
}
export interface CancelRequestSource {
    /**
     * 取消亲求数组项类型
     */
    [index: string]: () => void;
}
export interface HttpRequestType extends HttpRequestConfig {
    /**
     *
     * @param config 请求配置项
     * @description 请求函数
     */
    request<T>(config: HttpRequestConfig<T>): Promise<T>;
    /**
     * @description 取消所有请求
     */
    cancelAllRequest(): void;
    /**
     *
     * @param url 传递一个字符串或者数组
     * @description 取消请求函数
     */
    cancelRequest(url: string | string[]): void;
}
