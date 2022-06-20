import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { HttpInterceptor, HttpRequestConfig, CancelRequestSource } from "./types";
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
    loadingCount: number;
    private DEFAULT_LOADING;
    private DEFAULT_MESSAGE;
    constructor(config: HttpRequestConfig);
    request<T>(config: HttpRequestConfig<T>): Promise<T>;
    private getRequestIndex;
    private deleteUrl;
    cancelAllRequest(): void;
    cancelRequest(url: string | string[]): void;
}
