import { Route } from "./routes";

class Api {
  serverUrl = "https://bp-api.geoscribble.de/";
  token = "";
  refreshToken = "";

  setToken(token: string): void {
    this.token = token;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  execute = async (route: Route): Promise<ApiResponse> => {
    /**
     * Wait for a token on authorized requests
     * Wait a max of 5 seconds
     */
    let i = 0;
    while (route.needsAuth && this.token === "" && ++i < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    let response;
    switch (route.method) {
      case "GET":
        response = this.executeGet(route);
        break;
      case "POST":
        response = this.executePost(route);
        break;
    }
    response.then((response) => {
      if (response.success) {
        return;
      }
      if (response.description === "Token is not valid") {
        // TODO: Redirect to login
      }
    });
    return response.catch((error) => {
      console.error(error);
      return {
        success: false,
        data: {},
        description: "Unable to connect to server.",
      };
    });
  };

  executeGet = (route: Route): Promise<ApiResponse> => {
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
      headers: { "Session-Token": this.token },
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

  postWithBody = (
    route: string,
    body: Record<string, unknown>
  ): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());
  };

  postWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      headers: { "Session-Token": this.token },
    }).then((r) => r.json());
  };

  postWithAuthAndBody = (
    route: string,
    body: Record<string, unknown>
  ): Promise<ApiResponse> => {
    return fetch(this.parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Session-Token": this.token,
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
  };

  parseRoute = (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substring(1);
    }
    if (this.serverUrl.endsWith("/")) {
      return this.serverUrl + route;
    } else {
      return this.serverUrl + "/" + route;
    }
  };

  openSocket = async (): Promise<ApiSocketConnection> => {
    /**
     * Wait for a token on authorized requests
     * Wait a max of 5 seconds
     */
    let i = 0;
    while (this.token === "" && ++i < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const str = this.serverUrl
      .replace(/http:\/\//, "ws://")
      .replace(/https:\/\//, "wss://");

    return new ApiSocketConnection(this.token, str);
  };
}

export class ApiSocketConnection {
  readonly token: string;
  private ws: WebSocket;

  constructor(token: string, url: string) {
    this.token = token;
    this.ws = new WebSocket(url + "ws/socket");

    this.ws.onopen = (event) => {
      this.ws.send(
        JSON.stringify({
          message_type: "authenticate",
          data: { session_token: this.token },
        })
      );
      if (this.onopen) this.onopen(event);
    };

    this.send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) =>
      this.ws.send(data);

    this.ws.onerror = () => this.onerror;

    this.ws.onmessage = (message) => {
      if (this.onmessage) this.onmessage(JSON.parse(message.data));
    };

    this.ws.onclose = (closeEvent) => {
      if (this.onclose) this.onclose(closeEvent);
    };
  }

  onopen: ((event: Event) => unknown) | null = null;

  readonly send;

  onerror: (event: Event) => unknown = (event) =>
    console.error("WebSocket closed due to an error! Error: " + event);

  onmessage: ((message: WebsocketResponse | undefined) => unknown) | null =
    null;

  onclose: ((event: CloseEvent) => unknown) | null = null;

  close: () => void = () => this.ws.close();

  connected: () => boolean = () => this.ws.readyState === WebSocket.OPEN;
}

interface ApiResponse {
  success: boolean;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

interface WebsocketResponse extends ApiResponse {
  message_type: string;
}

export default new Api();
