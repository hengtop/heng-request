'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

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
var HttpRequest = /** @class */ (function () {
    function HttpRequest(config) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.loadingCount = 0;
        this.DEFAULT_LOADING = true;
        this.DEFAULT_MESSAGE = true;
        this.instance = axios__default["default"].create(config);
        this.interceptors = config.interceptors;
        this.showLoading = (_a = config.showLoading) !== null && _a !== void 0 ? _a : this.DEFAULT_LOADING;
        this.showResponseMessage =
            (_b = config.showResponseMessage) !== null && _b !== void 0 ? _b : this.DEFAULT_MESSAGE;
        this.cancleRequests = config.cancleRequests;
        this.handleCallback = config.handleCallback;
        //配置单个实例的拦截器
        this.instance.interceptors.request.use((_c = this.interceptors) === null || _c === void 0 ? void 0 : _c.requestInterceptor, (_d = this.interceptors) === null || _d === void 0 ? void 0 : _d.requestInterceptorCatch);
        this.instance.interceptors.response.use((_e = this.interceptors) === null || _e === void 0 ? void 0 : _e.responseInterceptor, (_f = this.interceptors) === null || _f === void 0 ? void 0 : _f.responseInterceptorCatch);
        //配置所有实例使用的拦截器
        this.instance.interceptors.request.use(function (config) {
            var _a, _b, _c;
            if ((_a = config.showLoading) !== null && _a !== void 0 ? _a : _this.showLoading) {
                _this.loadingCount++;
                (_c = (_b = _this.handleCallback) === null || _b === void 0 ? void 0 : _b.loadingStart) === null || _c === void 0 ? void 0 : _c.call(_b);
            }
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        this.instance.interceptors.response.use(function (res) {
            return res.data;
        }, function (err) {
            return Promise.reject(err);
        });
    }
    HttpRequest.prototype.request = function (config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.requestInterceptor) {
                config = config.interceptors.requestInterceptor(config);
            }
            var url = config.url;
            if (url) {
                config.cancelToken = new axios__default["default"].CancelToken(function (c) {
                    var _a;
                    var _b;
                    (_b = _this.cancleRequests) === null || _b === void 0 ? void 0 : _b.push((_a = {},
                        _a[url] = c,
                        _a));
                });
            }
            _this.instance
                .request(config)
                .then(function (res) {
                var _a, _b, _c, _d, _e, _f, _g;
                if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.responseInterceptor) {
                    res = config.interceptors.responseInterceptor(res);
                }
                if ((_b = config.showResponseMessage) !== null && _b !== void 0 ? _b : _this.showResponseMessage) {
                    (_d = (_c = _this.handleCallback) === null || _c === void 0 ? void 0 : _c.response) === null || _d === void 0 ? void 0 : _d.call(_c);
                }
                if (((_e = config.showLoading) !== null && _e !== void 0 ? _e : _this.showLoading) &&
                    --_this.loadingCount === 0) {
                    (_g = (_f = _this.handleCallback) === null || _f === void 0 ? void 0 : _f.loadingEnd) === null || _g === void 0 ? void 0 : _g.call(_f);
                }
                resolve(res);
            })
                .catch(function (err) {
                var _a, _b, _c, _d, _e, _f;
                if ((_a = config.showResponseMessage) !== null && _a !== void 0 ? _a : _this.showResponseMessage) {
                    (_c = (_b = _this.handleCallback) === null || _b === void 0 ? void 0 : _b.responseErr) === null || _c === void 0 ? void 0 : _c.call(_b, err);
                }
                if (((_d = config.showLoading) !== null && _d !== void 0 ? _d : _this.showLoading) &&
                    --_this.loadingCount === 0) {
                    (_f = (_e = _this.handleCallback) === null || _e === void 0 ? void 0 : _e.loadingEnd) === null || _f === void 0 ? void 0 : _f.call(_e);
                }
                reject(err);
            })
                .finally(function () {
                url && _this.deleteUrl(url);
            });
        });
    };
    HttpRequest.prototype.getRequestIndex = function (url) {
        var _a;
        return (_a = this.cancleRequests) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return Object.keys(item)[0] === url; });
    };
    HttpRequest.prototype.deleteUrl = function (url) {
        var _a;
        var index = this.getRequestIndex(url);
        index !== -1 && ((_a = this.cancleRequests) === null || _a === void 0 ? void 0 : _a.splice(index, 1));
    };
    HttpRequest.prototype.cancelAllRequest = function () {
        var _a;
        (_a = this.cancleRequests) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
            var key = Object.keys(item)[0];
            item[key]();
        });
    };
    HttpRequest.prototype.cancelRequest = function (url) {
        var _this = this;
        var _a;
        if (typeof url === "string") {
            var index = this.getRequestIndex(url);
            index !== -1 && ((_a = this.cancleRequests) === null || _a === void 0 ? void 0 : _a[index][url]());
        }
        else {
            url.forEach(function (item) {
                var _a;
                var index = _this.getRequestIndex(item);
                index !== -1 && ((_a = _this.cancleRequests) === null || _a === void 0 ? void 0 : _a[index][item]());
            });
        }
    };
    return HttpRequest;
}());

exports.HttpRequest = HttpRequest;
