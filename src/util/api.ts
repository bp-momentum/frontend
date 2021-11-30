import { Route } from "./routes";

class Api {
  serverUrl = "http://78.46.150.116:8000/";
  token = "";
  refreshToken = "";

  setToken(token: string): void {
    this.token = token;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  execute = (route: Route) : Promise<ApiResponse> => {
    let response;
    switch (route.method) {
    case "GET":
      response = this.executeGet(route);
      break;
    case "POST":
      response = this.executePost(route);
      break;
    }

    return response.catch((error) => {
      console.error(error);
      return {
        success: false,
        data: {},
        description: "Unable to connect to server."
      };
    });
  };

  executeGet = (route: Route) : Promise<ApiResponse> => {
    if (route.needsAuth) {
      return this.getWithAuth(route.route);
    } else {
      return this.get(route.route);
    }
  };

  get = (route: string): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
    }).then((r) => r.json());
  };

  getWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "GET",
      headers: {"Session-Token": this.token}
    }).then((r) => r.json());
  };

  executePost = (route: Route): Promise<ApiResponse> => {
    if (route.needsAuth) {
      if (route.body == null) {
        return this.postWithAuth(route.route);
      } else {
        return this.postWithAuthAndBody(route.route, route.body);
      }
    } else {
      if (route.body == null) {
        return this.post(route.route);
      } else {
        return this.postWithBody(route.route, route.body);
      }
    }
  };

  post = (route: string): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
    }).then((r) => r.json());
  };

  postWithBody = (route: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"}
    }).then((r) => r.json());
  };

  postWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      headers: {"Session-Token": this.token}
    }).then((r) => r.json());
  };

  postWithAuthAndBody = (route: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Session-Token": this.token,
        "Content-Type": "application/json"
      }
    }).then((r) => r.json());
  };

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
}

interface ApiResponse {
  success: boolean;
  description: string;
  data: Record<string, any>;
}

export default new Api();
