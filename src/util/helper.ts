import { Buffer } from "buffer";
import Translations from "@localization/translations";

/**
 * Contains different utility methods used across the site.
 */
const Helper = {
  /**
   * Returns the account-type of a user by a given token.
   * @param {string} token  the user's token
   * @returns {string} the account-type of the user
   */
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
    return jwt["account_type"] as "user" | "trainer" | "admin";
  },

  /**
   * Returns the username of a user by a given token.
   * @param {string} token  the user's token
   * @returns {string} the username of the user
   */
  getUserName: (token: string): string => {
    const payload = Helper.getJWTPayload(token);
    if (!payload["username"] || typeof payload["username"] !== "string") {
      return "";
    }
    return payload["username"];
  },

  /**
   * Checks if the given session token is still valid.
   * Session Tokens are valid for one day.
   * @param {string} token  the token to check
   * @returns {boolean} true if the token is still valid, false otherwise
   */
  isSessionTokenValid: (token?: string | null): boolean =>
    Helper.checkTokenTime(86400000, token),

  /**
   * Checks if the given refresh token is still valid.
   * Refresh Tokens are valid for 30 days.
   * @param {string} token  the token to check
   * @returns {boolean} true if the token is still valid, false otherwise
   */
  isRefreshTokenValid: (token?: string | null): boolean =>
    Helper.checkTokenTime(2592000000, token),

  /**
   * Checks if the given token is still valid.
   * @param {number} timeout  the time before a token becomes invalid
   * @param {string} token    the token to check
   * @returns {boolean} true if the token is still valid, false otherwise
   */
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

  /**
   * Extracts the payload out of a given token.
   * @param {string} token  the token
   * @returns {Record<string, unknown>} the payload of the token
   */
  getJWTPayload: (token: string): Record<string, unknown> => {
    const split = token.split(".");
    if (split.length !== 3) return {};
    const payload = split[1];
    return JSON.parse(Buffer.from(payload, "base64").toString("ascii"));
  },

  /**
   * This script is released to the public domain and may be used, modified and
   * distributed without restrictions. Attribution not necessary but appreciated.
   * Source: https://weeknumber.com/how-to/javascript
   * Returns the ISO week of the date.
   * @param {Date} d  the {@link Date} to check
   * @returns {number} the ISO week of the date
   */
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

  /**
   * Returns the english name of the current day.
   * @returns {string} the english name of the current day
   */
  getCurrentDayName: (): string => {
    return new Date()
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase();
  },

  /**
   * Returns the ISO week of the current date.
   * @returns {number} the ISO week of the current date
   */
  getCurrentWeek: (): number => {
    return Helper.getWeek(new Date());
  },

  /**
   * The maximum allowed username length.
   */
  maxUsernameLength: 50,

  /**
   * Checks if a username contains only allowed characters and has a valid length.
   * @param {string} username  the username to check
   * @returns {boolean} true if the username is valid, false otherwise
   */
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

export const hashCode = (str: string) => {
  let hash = 0;
  let i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export default Helper;
