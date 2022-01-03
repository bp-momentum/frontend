import {} from "@testing-library/react";

describe("Sanity", () => {
  test("Truth", () => {
    expect(true).toBe(true);
  });

  test("False", () => {
    expect(false).not.toBe(true);
  });

  test("Truthy", () => {
    expect(true).toBeTruthy();
  });

  test("Falsy", () => {
    expect(false).toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(0).toBeFalsy();
  });

  test("Equal", () => {
    expect(1).toEqual(1);
  });

  test("Not Equal", () => {
    expect(1).not.toEqual(2);
  });

  test("Greater Than", () => {
    expect(2).toBeGreaterThan(1);
  });

  test("Less Than", () => {
    expect(1).toBeLessThan(2);
  });

  test("Null", () => {
    expect(null).toBeNull();
  });

  test("Undefined", () => {
    expect(undefined).toBeUndefined();
  });

  test("Defined", () => {
    expect(undefined).not.toBeDefined();
  });

  test("NaN", () => {
    expect(NaN).toBeNaN();
  });

  test("InstanceOf", () => {
    expect(new Date()).toBeInstanceOf(Date);
  });

  test("Contain", () => {
    expect("Hello World").toContain("Hello");
  });

  test("Match", () => {
    expect("Hello World").toMatch(/Hello/);
  });

  test("Array Contain", () => {
    expect([1, 2, 3]).toContain(2);
  });

  test("Array Not Contain", () => {
    expect([1, 2, 3]).not.toContain(4);
  });

  test("Array Equal", () => {
    expect([1, 2, 3]).toEqual([1, 2, 3]);
  });

  test("Array Not Equal", () => {
    expect([1, 2, 3]).not.toEqual([1, 2, 4]);
  });

  test("Array Deep Equal", () => {
    expect([{ a: 1 }, { b: 2 }]).toEqual([{ a: 1 }, { b: 2 }]);
  });

  test("Array Deep Not Equal", () => {
    expect([{ a: 1 }, { b: 2 }]).not.toEqual([{ a: 1 }, { b: 3 }]);
  });

  test("Object Equal", () => {
    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
  });

  test("Object Not Equal", () => {
    expect({ a: 1, b: 2 }).not.toEqual({ a: 1, b: 3 });
  });

  test("Object Deep Equal", () => {
    expect({ a: { b: 1 }, c: 2 }).toEqual({ a: { b: 1 }, c: 2 });
  });

  test("Object Deep Not Equal", () => {
    expect({ a: { b: 1 }, c: 2 }).not.toEqual({ a: { b: 1 }, c: 3 });
  });

  test("Array Equal Length", () => {
    expect([1, 2, 3]).toHaveLength(3);
  });

  test("Array Not Equal Length", () => {
    expect([1, 2, 3]).not.toHaveLength(4);
  });
});
