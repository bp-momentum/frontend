import Helper from "./helper";

test("extract account type from an access token", () => {
  const token = "abc.eyJhY2NvdW50X3R5cGUiOiJhZG1pbiIsInRva2VudGltZSI6MTYzODAzMjQyOSwidXNlcm5hbWUiOiJhZG1pbiJ9.def";
  expect(Helper.getAccountType(token)).toBe("admin");
});

test("check token validity", () => {
  const token = "abc.eyJhY2NvdW50X3R5cGUiOiJhZG1pbiIsInRva2VudGltZSI6MTYzODAzMjQyOSwidXNlcm5hbWUiOiJhZG1pbiJ9.def";
  expect(Helper.isSessionTokenValid(token)).toBe(true);
  expect(Helper.isSessionTokenValid()).toBe(false);
  expect(Helper.isSessionTokenValid(null)).toBe(false);
  expect(Helper.isSessionTokenValid(undefined)).toBe(false);

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

    const json = JSON.stringify({
      tokentime: time,
    });

    const t = "abc." + btoa(json) + ".def";
    expect(Helper.isSessionTokenValid(t)).toBe(test.expect && test.session);
    expect(Helper.isRefreshTokenValid(t)).toBe(test.expect || test.session);
  }
});
