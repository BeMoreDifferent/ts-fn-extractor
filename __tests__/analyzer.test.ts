import { analyzeProject } from "../src/analyzer.js";
import { CliOptions } from "../src/types.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "fixtures", "sample-project");

describe("analyzeProject", () => {
  const baseOptions: CliOptions = {
    cwd: fixturesDir,
    withSubfunctions: false,
    lintMode: "none",
  };

  it("should find all functions in a project", () => {
    const result = analyzeProject(baseOptions);

    expect(result.length).toBeGreaterThan(0);
    const functionNames = result.map(f => f.name);
    expect(functionNames).toContain("greet");
    expect(functionNames).toContain("add");
  });

  it("should extract JSDoc comments", () => {
    const result = analyzeProject(baseOptions);
    const greetFunc = result.find(f => f.name === "greet");

    expect(greetFunc).toBeDefined();
    expect(greetFunc?.jsDoc).toBeDefined();
    expect(greetFunc?.jsDoc).toContain("A simple test function");
    expect(greetFunc?.jsDoc).toContain("@param name");
  });

  it("should filter by specific file", () => {
    const opts: CliOptions = {
      ...baseOptions,
      file: "simple.ts",
    };

    const result = analyzeProject(opts);
    const functionNames = result.map(f => f.name);

    expect(functionNames).toContain("greet");
    expect(functionNames).toContain("add");
    expect(functionNames).not.toContain("multiply");
  });

  it("should filter by function name", () => {
    const opts: CliOptions = {
      ...baseOptions,
      functionName: "greet",
    };

    const result = analyzeProject(opts);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("greet");
  });

  it("should identify different function kinds", () => {
    const result = analyzeProject(baseOptions);

    const regularFunc = result.find(f => f.name === "greet");
    expect(regularFunc?.kind).toBe("function");

    const arrowFunc = result.find(f => f.name === "multiply");
    expect(arrowFunc?.kind).toBe("arrow");

    const funcExpr = result.find(f => f.name === "divide");
    expect(funcExpr?.kind).toBe("function-expression");

    const method = result.find(f => f.name === "findUser");
    expect(method?.kind).toBe("method");
  });

  it("should collect interfaces and types from the same file", () => {
    const opts: CliOptions = {
      ...baseOptions,
      file: "types.ts",
    };

    const result = analyzeProject(opts);
    const getUserFunc = result.find(f => f.name === "getUserById");

    expect(getUserFunc).toBeDefined();
    expect(getUserFunc?.interfaces).toBeDefined();
    expect(getUserFunc?.types).toBeDefined();

    const interfaceNames = getUserFunc?.interfaces.map(i => i.name);
    expect(interfaceNames).toContain("User");

    const typeNames = getUserFunc?.types.map(t => t.name);
    expect(typeNames).toContain("UserId");
  });

  it("should extract function signatures", () => {
    const result = analyzeProject(baseOptions);
    const addFunc = result.find(f => f.name === "add");

    expect(addFunc).toBeDefined();
    expect(addFunc?.signature).toBeDefined();
    expect(addFunc?.signature).toContain("number");
  });

  it("should collect subfunctions when enabled", () => {
    const opts: CliOptions = {
      ...baseOptions,
      withSubfunctions: true,
      functionName: "withSubfunctions",
    };

    const result = analyzeProject(opts);

    expect(result).toHaveLength(1);
    const mainFunc = result[0];
    expect(mainFunc.subfunctions).toBeDefined();
    expect(mainFunc.subfunctions!.length).toBeGreaterThan(0);

    const subFunctionNames = mainFunc.subfunctions!.map(s => s.name);
    expect(subFunctionNames).toContain("helper");
    expect(subFunctionNames).toContain("anotherHelper");
  });

  it("should not collect subfunctions when disabled", () => {
    const opts: CliOptions = {
      ...baseOptions,
      withSubfunctions: false,
      functionName: "withSubfunctions",
    };

    const result = analyzeProject(opts);

    expect(result).toHaveLength(1);
    expect(result[0].subfunctions).toBeUndefined();
  });

  it("should include file paths in results", () => {
    const result = analyzeProject(baseOptions);

    result.forEach(fn => {
      expect(fn.filePath).toBeDefined();
      expect(path.isAbsolute(fn.filePath)).toBe(true);
      expect(fn.filePath).toContain("sample-project");
    });
  });

  it("should throw error if tsconfig.json not found", () => {
    const opts: CliOptions = {
      cwd: "/nonexistent/path",
      withSubfunctions: false,
      lintMode: "none",
    };

    expect(() => analyzeProject(opts)).toThrow("tsconfig.json not found");
  });
});
