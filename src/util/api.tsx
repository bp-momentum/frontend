import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Route } from "./routes";
import { unsetRefreshToken, unsetToken } from "@redux/token/tokenSlice";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

export const serverUrl = "https://bp-api.geoscribble.de/";

const useApi = () => {
  const token = useAppSelector((state) => state.token.token) ?? "";
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const execute = async (route: Route): Promise<ApiResponse> => {
    /**
     * Wait for a token on authorized requests
     * Wait a max of 5 seconds
     */
    let i = 0;
    while (route.needsAuth && token === "" && ++i < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    let response;
    switch (route.method) {
      case "GET":
        response = executeGet(route);
        break;
      case "POST":
        response = executePost(route);
        break;
    }
    response.then((response) => {
      if (response.success) {
        return;
      }
      if (response.description === "Token is not valid") {
        message.error(t(Translations.errors.loggedOut));
        dispatch(unsetToken());
        dispatch(unsetRefreshToken());
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

  const executeGet = (route: Route): Promise<ApiResponse> => {
    if (route.needsAuth) {
      return getWithAuth(route.route);
    } else {
      return get(route.route);
    }
  };

  const get = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "GET",
    }).then((r) => r.json());
  };

  const getWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "GET",
      headers: { "Session-Token": token },
    }).then((r) => r.json());
  };

  const executePost = (route: Route): Promise<ApiResponse> => {
    if (route.needsAuth) {
      if (route.body == null) {
        return postWithAuth(route.route);
      } else {
        return postWithAuthAndBody(route.route, route.body);
      }
    } else {
      if (route.body == null) {
        return post(route.route);
      } else {
        return postWithBody(route.route, route.body);
      }
    }
  };

  const post = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
    }).then((r) => r.json());
  };

  const postWithBody = (
    route: string,
    body: Record<string, unknown>
  ): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());
  };

  const postWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
      headers: { "Session-Token": token },
    }).then((r) => r.json());
  };

  const postWithAuthAndBody = (
    route: string,
    body: Record<string, unknown>
  ): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Session-Token": token,
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
  };

  const parseRoute = (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substring(1);
    }
    if (serverUrl.endsWith("/")) {
      return serverUrl + route;
    } else {
      return serverUrl + "/" + route;
    }
  };

  const openSocket = async (): Promise<ApiSocketConnection> => {
    /**
     * Wait for a token on authorized requests
     * Wait a max of 5 seconds
     */
    let i = 0;
    while (token === "" && ++i < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const str = serverUrl
      .replace(/http:\/\//, "ws://")
      .replace(/https:\/\//, "wss://");

    return new ApiSocketConnection(token, str);
  };

  return { execute, openSocket };
};

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

export default useApi;
