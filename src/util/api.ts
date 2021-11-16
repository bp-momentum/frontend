import fetch from "node-fetch";
import {Route} from "./routes";

export default class Api {
  static serverUrl = "http://78.46.150.116:8000/";

  static execute = (route: Route, body?: Record<string, unknown>) : Promise<unknown> | undefined => {
    switch (route.method) {
    case "GET":
      return this.executeGet(route);
    case "POST":
      return this.executePost(route, body);
    }
  }

  static executeGet = (route: Route) : Promise<unknown> => {
    if (route.needsAuth) {
      return this.get(route.route);
    } else {
      return this.getWithAuth(route.route);
    }
  }

  static get = (route: string): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
    }).then((r) => r.json());
  }

  static getWithAuth = (route: string): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
      headers: {"X-Auth-Token": "Token"}
    }).then((r) => r.json());
  }

  static executePost = (route: Route, body?: Record<string, unknown>): Promise<unknown> | undefined => {
    if (!this.checkBody(route, body)) {
      throw Error("Invalid body provided!");
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

  static post = (route: string): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
    }).then((r) => r.json());
  }

  static postWithBody = (route: string, body: Record<string, unknown>): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((r) => r.json());
  }

  static postWithAuth = (route: string): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      headers: {"X-Auth-Token": "Token"}
    }).then((r) => r.json());
  }

  static postWithAuthAndBody = (route: string, body: Record<string, unknown>): Promise<unknown> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Auth-Token": "Token",
        "Content-Type": "application/json"
      }
    }).then((r) => r.json());
  }

  static parseRoute = (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substr(1);
    }
    if (this.serverUrl.endsWith("/")) {
      return this.serverUrl + route;
    } else {
      return this.serverUrl + "/" + route;
    }
  }

  static checkBody = (route: Route, body?: Record<string, unknown>): boolean => {
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
