import {Route} from "./routes";

class Api {
  serverUrl = "http://78.46.150.116:8000/";

  executeAndGetJson = (route: Route, body?: Record<string, unknown>) : Promise<unknown> | undefined => {
    return this.execute(route, body)?.then((r) => r.json());
  }

  execute = (route: Route, body?: Record<string, unknown>) : Promise<Response> | undefined => {
    switch (route.method) {
    case "GET":
      return this.executeGet(route);
    case "POST":
      return this.executePost(route, body);
    }
  }

  executeGet = (route: Route) : Promise<Response> => {
    if (route.needsAuth) {
      return this.get(route.route);
    } else {
      return this.getWithAuth(route.route);
    }
  }

  get = (route: string): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
    });
  }

  getWithAuth = (route: string): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
      headers: {"X-Auth-Token": "Token"}
    });
  }

  executePost = (route: Route, body?: Record<string, unknown>): Promise<Response> | undefined => {
    if (!this.checkBody(route, body)) {
      throw new Error("Invalid body provided!");
    }

    if (route.needsAuth) {
      if (route.body == null) {
        return this.post(route.route);
      } else if (body != null) {
        return  this.postWithBody(route.route, body);
      }
    } else {
      if (route.body == null) {
        return this.postWithAuth(route.route);
      } else if (body != null) {
        return this.postWithAuthAndBody(route.route, body);
      }
    }
  }

  post = (route: string): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
    });
  }

  postWithBody = (route: string, body: Record<string, unknown>): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    });
  }

  postWithAuth = (route: string): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      headers: {"X-Auth-Token": "Token"}
    });
  }

  postWithAuthAndBody = (route: string, body: Record<string, unknown>): Promise<Response> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Auth-Token": "Token",
        "Content-Type": "application/json"
      }
    });
  }

  parseRoute = (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substr(1);
    }
    if (this.serverUrl.endsWith("/")) {
      return this.serverUrl + route;
    } else {
      return this.serverUrl + "/" + route;
    }
  }

  checkBody = (route: Route, body?: Record<string, unknown>): boolean => {
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
}

const api = new Api();
export default api;
