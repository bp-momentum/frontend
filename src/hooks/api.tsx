import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Route } from "@util/routes";
import { unsetRefreshToken, unsetToken } from "@redux/token/tokenSlice";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import config from "@config";

/**
 * This api handles all requests to the backend.
 * @returns {Api} The api.
 */
const useApi = () => {
  const token = useAppSelector((state) => state.token.token) ?? "";
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  /**
   * Executes a requests to the backend with the given {@link Route}.
   * It selects the correct method and sends necessary parameters as defined in the given {@link Route}.
   *
   * This method also checks if the token of the user is still valid and forces the user to log in manually again
   * if it's not.
   *
   * @param {Route} route  the {@link Route} to request
   * @returns {Promise<Response>} The response of the request.
   */
  const execute = async (route: Route): Promise<ApiResponse> => {
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

  /**
   * Fetches a {@link Route} with the GET method.
   * It forwards the call to {@link getWithAuth} or {@link get} depending on whether the route requires
   * authentication or not.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
  const executeGet = (route: Route): Promise<ApiResponse> => {
    if (route.needsAuth) {
      return getWithAuth(route.route);
    } else {
      return get(route.route);
    }
  };

  /**
   * Fetches a {@link Route} with the GET method without authentication.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
  const get = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "GET",
    }).then((r) => r.json());
  };

  /**
   * Fetches a {@link Route} with the GET method with authentication.
   * The user's session token will be sent inside the request header.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
  const getWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "GET",
      headers: { "Session-Token": token },
    }).then((r) => r.json());
  };

  /**
   * Requests a {@link Route} with the POST method.
   * If the given {@link Route} requires authentication, this method will forward the call to {@link postWithAuth} or
   * {@link postWithAuthAndBody} depending on whether the route has any data to send or not.
   * If the given {@link Route} does not require authentication, this method will forward the call to {@link post} or
   * {@link postWithBody} depending on whether the route has any data to send or not.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
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

  /**
   * Requests a {@link Route} with the POST method without authentication and without any data to send.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
  const post = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
    }).then((r) => r.json());
  };

  /**
   * Requests a {@link Route} with the POST method without authentication and with data to send.
   * @param {Route} route  the given {@link Route}
   * @param {Record<string, unkown>} body  object containing the data to send
   * @returns {Promise<Response>} The response of the request.
   */
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

  /**
   * Requests a {@link Route} with the POST method with authentication and without any data to send.
   * @param {Route} route  the given {@link Route}
   * @returns {Promise<Response>} The response of the request.
   */
  const postWithAuth = (route: string): Promise<ApiResponse> => {
    return fetch(parseRoute(route), {
      method: "POST",
      headers: { "Session-Token": token },
    }).then((r) => r.json());
  };

  /**
   * Requests a {@link Route} with the POST method with authentication and with data to send.
   * @param {Route} route  the given {@link Route}
   * @param {Record<string, unkown>} body  object containing the data to send
   * @returns {Promise<Response>} The response of the request.
   */
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

  /**
   * Concatenates the given route with the configured {@link config.backendUrl} to have the correct format.
   * @param {string} route  the given route as string
   * @returns {string} the concatenated route
   */
  const parseRoute = (route: string): string => {
    if (route.startsWith("/")) {
      route = route.substring(1);
    }
    if (config.backendUrl.endsWith("/")) {
      return config.backendUrl + route;
    } else {
      return config.backendUrl + "/" + route;
    }
  };

  /**
   * Creates a new {@link ApiSocketConnection} to send and retrieve data from the backend.
   * Uses the configured {@link config.websocketUrl} to connect to the websocket.
   * @returns {ApiSocketConnection} the created {@link ApiSocketConnection}
   */
  const openSocket = async (): Promise<ApiSocketConnection> => {
    return new ApiSocketConnection(token, config.websocketUrl);
  };

  return { execute, openSocket };
};

/**
 * Utility class to handle the websocket connection to the backend.
 */
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

  /**
   * Called when the websocket connection is opened.
   */
  onopen: ((event: Event) => unknown) | null = null;

  /**
   * Method to send data to the websocket.
   */
  readonly send;

  /**
   * Called when the websocket encounters an error.
   * @param {Event} event  the error event
   * @returns {void}
   */
  onerror: (event: Event) => unknown = (event: Event): void =>
    console.error("WebSocket closed due to an error! Error: " + event);

  /**
   * Called when the websocket connection receives a message from the backend.
   */
  onmessage: ((message: WebsocketResponse | undefined) => unknown) | null =
    null;

  /**
   * Called when the connection to the websocket is closed.
   */
  onclose: ((event: CloseEvent) => unknown) | null = null;

  /**
   * Method to close the connection to the websocket.
   * @returns {void}
   */
  close: () => void = (): void => this.ws.close();

  /**
   * Check if the connection to the websocket is currently connected.
   * @returns {boolean} true if the connection is open, false otherwise
   */
  connected: () => boolean = (): boolean =>
    this.ws.readyState === WebSocket.OPEN;
}

/**
 * Wrapper for any response from the backend.
 */
interface ApiResponse {
  success: boolean;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/**
 * Wrapper for any response from the backend websocket.
 */
interface WebsocketResponse extends ApiResponse {
  message_type: string;
}

export default useApi;
