import { runExtractor } from "../src/index.js";
import { CliOptions } from "../src/types.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "fixtures", "sample-project");

describe("runExtractor", () => {
  it("should return formatted output for all functions", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(typeof result).toBe("string");
    expect(result).toContain("Function: greet");
    expect(result).toContain("Function: add");
    expect(result).toContain("Signature:");
    expect(result).toContain("File:");
  });

  it("should filter by specific function name", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      functionName: "greet",
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("Function: greet");
    expect(result).not.toContain("Function: add");
  });

  it("should filter by specific file", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      file: "simple.ts",
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("Function: greet");
    expect(result).toContain("Function: add");
    expect(result).not.toContain("multiply");
  });

  it("should include subfunctions when requested", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      functionName: "withSubfunctions",
      withSubfunctions: true,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("Function: withSubfunctions");
    expect(result).toContain("Subfunctions:");
    expect(result).toContain("helper");
    expect(result).toContain("anotherHelper");
  });

  it("should include lint results when lint mode is all", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      file: "lintable.ts",
      withSubfunctions: false,
      lintMode: "all",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("Lint (all):");
  });

  it("should include JSDoc when present", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      functionName: "greet",
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("JSDoc:");
    expect(result).toContain("A simple test function");
  });

  it("should show interfaces and types", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      file: "types.ts",
      functionName: "getUserById",
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toContain("Interfaces:");
    expect(result).toContain("User");
    expect(result).toContain("Types:");
    expect(result).toContain("UserId");
  });

  it("should return empty string when no functions match", async () => {
    const opts: CliOptions = {
      cwd: fixturesDir,
      functionName: "nonExistentFunction",
      withSubfunctions: false,
      lintMode: "none",
    };

    const result = await runExtractor(opts);

    expect(result).toBe("");
  });

  it("should handle multiple lint modes", async () => {
    const optsNone: CliOptions = {
      cwd: fixturesDir,
      file: "simple.ts",
      withSubfunctions: false,
      lintMode: "none",
    };

    const resultNone = await runExtractor(optsNone);
    expect(resultNone).toContain("Lint: none");

    const optsWarn: CliOptions = {
      cwd: fixturesDir,
      file: "simple.ts",
      withSubfunctions: false,
      lintMode: "warn",
    };

    const resultWarn = await runExtractor(optsWarn);
    expect(resultWarn).toContain("Lint");
  });
});
