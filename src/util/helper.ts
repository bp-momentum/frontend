import { Buffer } from "buffer";
import Translations from "../localization/translations";

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

  getUserName: (token: string): string => {
    const payload = Helper.getJWTPayload(token);
    if (!payload["username"] || typeof payload["username"] !== "string") {
      return "";
    }
    return payload["username"];
  },

  // Session Token is valid for 1 day
  isSessionTokenValid: (token?: string | null): boolean =>
    Helper.checkTokenTime(86400000, token),
  // Refresh Token is valid for 30 days
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

  // This script is released to the public domain and may be used, modified and
  // distributed without restrictions. Attribution not necessary but appreciated.
  // Source: https://weeknumber.com/how-to/javascript
  // Returns the ISO week of the date.
  getWeek: (d: Date): number => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  },

  getCurrentDayName: (): string => {
    return new Date()
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase();
  },

  getCurrentWeek: (): number => {
    return Helper.getWeek(new Date());
  },

  maxUsernameLength: 50,
  checkUsername: (username: string): string | undefined => {
    if (username.length === 0) {
      return Translations.profile.usernameEmpty;
    } else if (username.length > Helper.maxUsernameLength) {
      return Translations.profile.usernameTooLong;
    } else if (!username.match(/^[A-Za-z0-9 _-]{3,50}$/)) {
      return Translations.profile.usernameNotAllowed;
    } else {
      return undefined;
    }
  },
};

export default Helper;
