import { Buffer } from "buffer";

const Helper = {
  getAccountType: (token: string): "user" | "trainer" | "admin" => {
    const jwt = Helper.getJWTPayload(token);
    if (
      !jwt["account_type"] ||
      (jwt["account_type"] !== "user" &&
        jwt["account_type"] !== "trainer" &&
        jwt["account_type"] !== "admin")
    ) {
      throw new Error("Invalid token");
    }
    return jwt["account_type"];
  },

  isSessionTokenValid: (token?: string | null): boolean =>
    Helper.checkTokenTime(86400000, token),
  isRefreshTokenValid: (token?: string | null): boolean =>
    Helper.checkTokenTime(2592000000, token),

  checkTokenTime: (timeout: number, token?: string | null): boolean => {
    if (!token) {
      return false;
    }
    const payload = Helper.getJWTPayload(token);
    if (!payload["tokentime"] || typeof payload["tokentime"] !== "number") {
      return false;
    }
    const tokenTime = payload["tokentime"] * 1000;
    const now = Date.now();
    return tokenTime > now - timeout;
  },

  getJWTPayload: (token: string): Record<string, unknown> => {
    const split = token.split(".");
    if (split.length !== 3) return {};
    const payload = split[1];
    return JSON.parse(Buffer.from(atob(payload)).toString("ascii"));
  },
};

export default Helper;
