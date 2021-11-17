import {Route} from "./routes";

const Api = {
  serverUrl: "http://78.46.150.116:8000/",

  execute: (route: Route, body?: Record<string, unknown>) : Promise<unknown> | undefined => {
    switch (route.method) {
    case "GET":
      return Api.executeGet(route);
    case "POST":
      return Api.executePost(route, body);
    }
  },

  executeGet: (route: Route) : Promise<unknown> => {
    if (route.needsAuth) {
      return Api.get(route.route);
    } else {
      return Api.getWithAuth(route.route);
    }
  },

  get: (route: string): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "GET",
    }).then((r: any) => r.json());
  },

  getWithAuth: (route: string): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "GET",
      headers: {"X-Auth-Token": "Token"}
    }).then((r: any) => r.json());
  },

  executePost: (route: Route, body?: Record<string, unknown>): Promise<unknown> | undefined => {
    if (!Api.checkBody(route, body)) {
      throw Error("Invalid body provided!");
    }

    if (route.needsAuth) {
      if (route.body == null) {
        return Api.postWithAuth(route.route);
      } else if (body != null) {
        return Api.postWithAuthAndBody(route.route, body);
      }
    } else {
      if (route.body == null) {
        return Api.post(route.route);
      } else if (body != null) {
        return Api.postWithBody(route.route, body);
      }
    }
  },

  post: (route: string): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
    }).then((r: any) => r.json());
  },

  postWithBody: (route: string, body: Record<string, unknown>): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((r: any) => r.json());
  },

  postWithAuth: (route: string): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      headers: {"X-Auth-Token": "Token"}
    }).then((r: any) => r.json());
  },

  postWithAuthAndBody: (route: string, body: Record<string, unknown>): Promise<unknown> => {
    return fetch(Api.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Auth-Token": "Token",
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json());
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
  },

  checkBody: (route: Route, body?: Record<string, unknown>): boolean => {
    if (route.body == null)
      return true;

    for (const key in route.body) {
      const parameter = route.body[key];
      if (parameter.required) {
        if (!body || body[key] == null)
          return false;
      }
    }
    return true;
  }

};


export default Api;