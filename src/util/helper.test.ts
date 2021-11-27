import Helper from "./helper";

test("extracts account type from a token", () => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3R5cGUiOiJhZG1pbiIsInRva2VudGltZSI6MTYzODAzMjQyOSwidXNlcm5hbWUiOiJhZG1pbiJ9.pwkoXtEqPuQ8khoRvATUS4xg-sAtmqMcP3zbTo5k9Yc";
  expect(Helper.getAccountType(token)).toBe("admin");
});

export {};
