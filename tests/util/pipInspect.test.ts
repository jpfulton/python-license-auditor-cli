import { getPipInspectOutput } from "../../src/util/pipInspect";

describe("getPipInspectOutput", () => {
  it("should throw an error if the file does not exist", () => {
    expect(() => getPipInspectOutput("foo")).toThrow("File not found: foo");
  });

  it("should throw an error if the file is not a JSON", () => {
    expect(() => getPipInspectOutput("tests/util/pipInspect.test.ts")).toThrow(
      "Unexpected token"
    );
  });

  it("should return the JSON content of the file", () => {
    const fileName = "tests/fixtures/pip-inspect.json";

    const result = getPipInspectOutput(fileName);

    expect(typeof result).toBe("object");
    expect(result).toHaveProperty("installed");
    expect(result.installed.length).toBeGreaterThan(0);
  });
});
