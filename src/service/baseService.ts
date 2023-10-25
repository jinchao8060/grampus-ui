import { IHttpResponse, IObject } from "@/types/interface";
import http, { httpDownloader } from "../utils/http";

/**
 * 常用CRUD
 */
export default {
  /**
   * 删除
   * @param path
   * @param params
   * @returns
   */
  delete(path: string, params: IObject): Promise<IHttpResponse> {
    deleteNullParams(params);
    return http({
      url: path,
      data: params,
      method: "DELETE"
    });
  },
  /**
   * 通用get方法
   * @param path
   * @param params
   * @param headers
   */
  get(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    deleteNullParams(params);
    return new Promise((resolve, reject) => {
      http({
        url: path,
        params,
        headers,
        method: "GET"
      })
        .then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
    });
  },
  /**
   * 通用put方法
   * @param path
   * @param params
   * @param headers
   */
  put(path: string, params?: IObject, headers?: IObject): Promise<IHttpResponse> {
    deleteNullParams(params);
    return http({
      url: path,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    });
  },
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  post(path: string, body?: IObject, headers?: IObject): Promise<IHttpResponse> {
    deleteNullParams(body);
    return http({
      url: path,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      data: body
    });
  },
  /**
   * 通用download方法
   * @param path
   * @param params
   * @param headers
   */
  download(path: string | undefined, params?: IObject, headers?: IObject): void {
    if (!path) return;
    deleteNullParams(params);
    httpDownloader.download(path, params, headers);
  }
};

/**
 * 删除空参数
 * @param params
 */
const deleteNullParams = (params?: IObject) => {
  for (const paramsKey in params) {
    if (params[paramsKey] === undefined || params[paramsKey] === null || params[paramsKey] === "") {
      delete params[paramsKey];
    }
  }
};
