import "i18next";
export {};

declare global {
  interface Window {
    _env_: {
      BACKEND_URL: string;
      WEBSOCKET_URL: string;
      FRONTEND_URL: string;
      DEBUG: boolean;
    };
  }
}

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
