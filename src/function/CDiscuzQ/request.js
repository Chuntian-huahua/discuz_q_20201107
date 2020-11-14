import HTTP from "./http";

let RequestModules = {};

let requestUrl = "";
let Authorization = "";

function createRequestUrl(route, query = {}) {
  let url = requestUrl + route;
  if (!query) {
    return url;
  }
  if (Object.keys(query).length > 0) {
    let urls = [];
    for (let key in query) {
      if (Array.isArray(query[key])) {
        urls.push(`${key}=${query[key].join(",")}`);
      } else {
        urls.push(`${key}=${query[key]}`);
      }
    }
    url += "?" + urls.join("&");
  }
  return url;
}

export default {
  requestUrl: "",
  setModules(modules) {
    RequestModules = modules;
  },
  getModule(moduleName = null) {
    if (!moduleName) {
      return RequestModules;
    }
    return RequestModules[moduleName];
  },
  setReuqestUrl(url) {
    requestUrl = url;
    this.requestUrl = url;
  },
  setAuthorization(authorization, type = "Bearer") {
    Authorization = `${type} ${authorization}`;
  },
  removeAuthorization() {
    Authorization = "";
  },
  async send(
    route = null,
    query = null,
    body = null,
    headers = null,
    method = "GET"
  ) {
    if (!requestUrl) {
      throw new Error("请求地址不存在 " + requestUrl);
    }

    let requestHeaders = {
      Accept: "application/vnd.api+json",
      Authorization,
      "Content-type": "application/vnd.api+json",
    };
    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    method = method.toLowerCase();
    if (
      RequestModules.hasOwnProperty(method) &&
      RequestModules[method].hasOwnProperty(route)
    ) {
      let module = RequestModules[method][route];
      let requestQuery = module.query || {};
      let requestBody = module.body || {};

      if (query !== null) {
        Object.assign(requestQuery, query);
      }

      if (module.headers) {
        Object.assign(requestHeaders, module.headers);
      }

      if (body) {
        Object.assign(requestBody, body);
      }
      if (requestBody && Object.keys(requestBody).length > 0) {
        requestBody = JSON.stringify(requestBody);
      }
      let url = createRequestUrl(route, requestQuery);
      return await HTTP.request(url, method, requestHeaders, requestBody);
    } else {
      let url = createRequestUrl(route, query);
      if (body && Object.keys(body).length > 0) {
        body = JSON.stringify(body);
      }
      return await HTTP.request(url, method, requestHeaders, body);
    }
  },
  async get(route = null, query = null, headers = null) {
    return await this.send(route, query, null, headers, "GET");
  },
  async post(route = null, body = null, query = null, headers = null) {
    return await this.send(route, query, body, headers, "POST");
  },
  /**
   * 发送数据
   * @param {string} route 请求URI
   * @param {object} attributes 提交的属性
   * @param {object} relationships 相关的数据
   * @param {object} data 发送的数据，会把attributes和relationships 添加这里
   * @param {string} query 请求的查询参数
   * @param {object} headers 请求的头部
   */
  async postData(
    route,
    attributes,
    relationships = null,
    data = {},
    query = null,
    headers = null
  ) {
    for (let key in relationships) {
      relationships[key] = {
        data: relationships[key],
      };
    }
    data["relationships"] = relationships;
    data["attributes"] = attributes;
    return await this.post(route, { data }, query, headers);
  },
  /**
   * 修改数据
   * @param {string} route 请求URI
   * @param {object} attributes 提交的属性
   * @param {object} relationships 相关的数据
   * @param {object} data 发送的数据，会把attributes和relationships 添加这里
   * @param {string} query 请求的查询参数
   * @param {object} headers 请求的头部
   */
  async patchData(
    route,
    attributes,
    relationships = null,
    data = {},
    query = null,
    headers = null
  ) {
    for (let key in relationships) {
      relationships[key] = {
        data: relationships[key],
      };
    }
    data["relationships"] = relationships;
    data["attributes"] = attributes;
    return await this.patch(route, { data }, query, headers);
  },
  async delete(route = null, query = null, headers = null) {
    return await this.send(route, query, null, headers, "DELETE");
  },
  async put(route = null, body = null, query = null, headers = null) {
    return await this.send(route, query, body, headers, "PUT");
  },
  async patch(route = null, body = null, query = null, headers = null) {
    return await this.send(route, query, body, headers, "PATCH");
  },
  async upload(
    file,
    data = null,
    route = "attachments",
    query = null,
    headers = null
  ) {
    let body = new FormData();
    body.append("file", file);
    for (let key in data) {
      body.append(key, data[key]);
    }
    let requestHeaders = {
      Accept: "application/vnd.api+json",
      Authorization,
    };
    Object.assign(requestHeaders, headers);
    let url = createRequestUrl(route, query);
    return await HTTP.request(url, "POST", requestHeaders, body);
  },
  errors(errors, messages = {}) {
    let errorMessages = [];
    for (let errorIndex in errors) {
      let error = errors[errorIndex];
      if (error.detail) {
        errorMessages.push(...error.detail);
      } else {
        if (messages.hasOwnProperty(error.code)) {
          errorMessages.push(messages[error.code]);
        } else if (messages.hasOwnProperty(error.status)) {
          errorMessages.push(messages[error.status]);
        } else {
          errorMessages.push(`${error.status} ${error.code}`);
        }
      }
    }
    return errorMessages;
  },
};
