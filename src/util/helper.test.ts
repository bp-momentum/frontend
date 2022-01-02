import Helper from "./helper";

const constructToken = (payload: Record<string, unknown>) => {
  const json = JSON.stringify(payload);
  return "abc." + btoa(json) + ".def";
};

test("extract payload from token", () => {
  expect(Helper.getJWTPayload(constructToken({}))).toStrictEqual({});
  expect(Helper.getJWTPayload("abc.def")).toStrictEqual({});
  expect(Helper.getJWTPayload("abc.def.ghi.jkl")).toStrictEqual({});
  expect(Helper.getJWTPayload(constructToken({test: true}))).toStrictEqual({test: true});
});

test("extract account type from token", () => {
  expect(Helper.getAccountType(constructToken({account_type: "admin"}))).toBe("admin");
  expect(() => Helper.getAccountType(constructToken({type: "admin"}))).toThrow("Invalid token");
  expect(() => Helper.getAccountType(constructToken({account_type: "owner"}))).toThrow("Invalid token");
});

test("extract username from token", () => {
  expect(Helper.getUserName(constructToken({username: "user"}))).toBe("user");
  expect(Helper.getUserName(constructToken({name: "user"}))).toBe("");
  expect(Helper.getUserName(constructToken({username: 0}))).toBe("");
});

test("check token validity", () => {
  const tests = [
    {
      minus: 2572000000,
      expect: true,
      session: false,
    },
    {
      minus: 2692000000,
      expect: false,
      session: false,
    },
    {
      minus: 86800000,
      expect: false,
      session: true,
    },
    {
      minus: 85400000,
      expect: true,
      session: true,
    }
  ];

  for (const i in tests) {
    const test = tests[i];
    const now = Date.now();
    const time = (now - test.minus) / 1000;

    const validToken = constructToken({tokentime: time});
    const invalidToken = constructToken({token_time: time});
    const invalidTokenType = constructToken({token_time: time.toString()});
    expect(Helper.isSessionTokenValid(validToken)).toBe(test.expect && test.session);
    expect(Helper.isRefreshTokenValid(validToken)).toBe(test.expect || test.session);
    expect(Helper.isSessionTokenValid(invalidToken)).toBe(false);
    expect(Helper.isSessionTokenValid(invalidToken)).toBe(false);
    expect(Helper.isRefreshTokenValid(invalidTokenType)).toBe(false);
    expect(Helper.isRefreshTokenValid(invalidTokenType)).toBe(false);
    expect(Helper.isSessionTokenValid(null)).toBe(false);
    expect(Helper.isRefreshTokenValid(null)).toBe(false);
    expect(Helper.isSessionTokenValid(undefined)).toBe(false);
    expect(Helper.isRefreshTokenValid(undefined)).toBe(false);
  }
});
