import {AccountType} from "./account";

const Helper = {
  getAccountType: (token: string) : AccountType | undefined => {
    return Helper.getJWTPayload(token)["account_type"];
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