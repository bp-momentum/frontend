import Helper from "./helper";

test("extract account type from an access token", () => {
  const token = "abc.eyJhY2NvdW50X3R5cGUiOiJhZG1pbiIsInRva2VudGltZSI6MTYzODAzMjQyOSwidXNlcm5hbWUiOiJhZG1pbiJ9.def";
  expect(Helper.getAccountType(token)).toBe("admin");
});
