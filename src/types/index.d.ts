export {};

declare global {
  interface Window {
    _env_: {
      BACKEND_URL: string;
      WEBSOCKET_URL: string;
      FRONTEND_URL: string;
    };
  }
}
