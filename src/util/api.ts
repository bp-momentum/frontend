import {Route} from "./routes";

const Api = {
  serverUrl: "http://78.46.150.116:8000/",

  execute: (route: Route) : Promise<ApiResponse> => {
    switch (route.method) {
    case "GET":
      return Api.executeGet(route);
    case "POST":
      return Api.executePost(route);
    }
  },

  executeGet: (route: Route) : Promise<ApiResponse> => {
    if (route.needsAuth) {
      return Api.get(route.route);
    } else {
      return Api.getWithAuth(route.route);
    }
  },

  get: (route: string): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "GET",
    }).then((r) => r.json());
  },

  getWithAuth: (route: string): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "GET",
      headers: {"X-Auth-Token": "Token"}
    }).then((r) => r.json());
  },

  executePost: (route: Route): Promise<ApiResponse> => {
    if (route.needsAuth) {
      if (route.body == null) {
        return Api.postWithAuth(route.route);
      } else {
        return Api.postWithAuthAndBody(route.route, route.body);
      }
    } else {
      if (route.body == null) {
        return Api.post(route.route);
      } else {
        return Api.postWithBody(route.route, route.body);
      }
    }
  },

  post: (route: string): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
    }).then((r) => r.json());
  },

  postWithBody: (route: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((r) => r.json());
  },

  postWithAuth: (route: string): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      headers: {"X-Auth-Token": "Token"}
    }).then((r) => r.json());
  },

  postWithAuthAndBody: (route: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Auth-Token": "Token",
        "Content-Type": "application/json"
      }
    }).then((r) => r.json());
  },

  parseRoute: (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substr(1);
    }
    if (Api.serverUrl.endsWith("/")) {
      return Api.serverUrl + route;
    } else {
      return Api.serverUrl + "/" + route;
    }
  }
};

interface ApiResponse {
  success: boolean;
  description: string;
  data: Record<string, any>;
}

export default Api;
