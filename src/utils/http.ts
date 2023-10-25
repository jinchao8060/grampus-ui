import app from "@/constants/app";
import { IHttpResponse, IObject } from "@/types/interface";
import router from "@/router";
import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { getToken } from "./cache";
import { getValueByKeys } from "./utils";
import { ElMessage } from "element-plus";
import download from "@/utils/download";

const http = axios.create({
  baseURL: app.api,
  timeout: app.requestTimeout
});

http.interceptors.request.use(
  function (config: any) {
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Request-Start"] = new Date().getTime();
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    if (config.method?.toUpperCase() === "GET") {
      config.params = { ...config.params, _t: new Date().getTime() };
    }
    if (Object.values(config.headers).includes("application/x-www-form-urlencoded")) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    // 响应成功
    if (response.data.status === 200) {
      return response;
    }

    // 错误提示
    ElMessage.error(response.data.message);

    if (response.data.status === 401) {
      //自定义业务状态码
      redirectLogin();
    }

    return Promise.reject(new Error(response.data.message || "Error"));
  },
  (error) => {
    const status = getValueByKeys(error, "response.status", 500);
    const httpCodeLabel: IObject<string> = {
      400: "请求参数错误",
      401: "未授权，请登录",
      403: "拒绝访问",
      404: `请求地址出错: ${getValueByKeys(error, "response.config.url", "")}`,
      408: "请求超时",
      500: "API接口报500错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持"
    };
    if (error && error.response) {
      console.error("请求错误", error.response.data);
    }
    if (status === 401) {
      redirectLogin();
    }
    return Promise.reject(new Error(httpCodeLabel[status] || "接口错误"));
  }
);

const redirectLogin = () => {
  router.replace("/login");
  return;
};

export default (o: AxiosRequestConfig): Promise<IHttpResponse> => {
  return new Promise((resolve, reject) => {
    http(o)
      .then((res) => {
        return resolve(res.data);
      })
      .catch(reject);
  });
};

export const httpDownloader = {
  download(path: string | undefined, params?: any, headers?: any): void {
    axios
      .create({
        baseURL: app.api,
        timeout: app.requestTimeout,
        headers: { Authorization: `Bearer ${getToken()}`, ...headers },
        responseType: "blob"
      })
      .get(`${app.api}${path}?${qs.stringify({ ...params })}`)
      .then((response) => {
        download.downloadFile(response);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  }
};

// export const httpDownloader = {
//   download(path: string | undefined, params?: IObject, headers?: IObject): void {
//     fetch(`${app.api}${path}?${qs.stringify({ ...params })}`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${getToken()}`, ...headers }
//     }).then((response) => {
//       download.downloadFile(response);
//     });
//   }
// };
