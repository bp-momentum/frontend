const Helper = {
  getAccountType: (token: string) : "user" | "trainer" | "admin" => {
    return Helper.getJWTPayload(token)["account_type"];
  },

  getUserName: (token: string) : string => {
    return Helper.getJWTPayload(token)["username"];
  },

  isSessionTokenValid: (token?: string | null) : boolean => Helper.checkTokenTime(86400000, token),
  isRefreshTokenValid: (token?: string | null) : boolean => Helper.checkTokenTime(2592000000, token),

  checkTokenTime: (timeout: number, token?: string | null) : boolean => {
    if (!token) {
      return false;
    }
    const payload = Helper.getJWTPayload(token);
    if (!payload["tokentime"]) {
      return false;
    }
    const tokenTime = payload["tokentime"] * 1000;
    const now = Date.now();
    return tokenTime > (now - timeout);
  },

  getJWTPayload: (token: string) : Record<string, any> => {
    const split = token.split(".");
    if (split.length !== 3)
      return {};
    const payload = split[1];
    return JSON.parse(Buffer.from(atob(payload)).toString("ascii"));
  }
};

export default Helper;
