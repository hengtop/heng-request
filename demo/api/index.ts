import httpRequest from "..";

export const testApi = () => {
  return httpRequest.request({
    url: "/article",
    showLoading: false,
    showResponseMessage: false,
    interceptors: {
      requestInterceptor(config) {
        return config;
      },
      responseInterceptor(res) {
        return res;
      },
    },
  });
};

export const testApi2 = () => {
  return httpRequest.request({
    url: "/users",
    interceptors: {
      requestInterceptor(config) {
        return config;
      },
      responseInterceptor(res) {
        return res;
      },
    },
  });
};
