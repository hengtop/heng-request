import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { HttpInterceptor, HttpRequestConfig, CancelRequestSource, HttpRequestType } from "./types";
export default class HttpRequest implements HttpRequestType {
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
    private LOADING_COUNT;
    private readonly DEFAULT_LOADING;
    private readonly DEFAULT_MESSAGE;
    constructor(config: HttpRequestConfig);
    request<T>(config: HttpRequestConfig<T>): Promise<T>;
    get<T>(config: HttpRequestConfig<T>): Promise<T>;
    post<T>(config: HttpRequestConfig<T>): Promise<T>;
    put<T>(config: HttpRequestConfig<T>): Promise<T>;
    patch<T>(config: HttpRequestConfig<T>): Promise<T>;
    delete<T>(config: HttpRequestConfig<T>): Promise<T>;
    private getRequestIndex;
    private deleteUrl;
    cancelAllRequest(): void;
    cancelRequest(url: string | string[]): void;
}
