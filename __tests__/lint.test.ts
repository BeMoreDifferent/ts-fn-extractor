import { lintFunctions } from "../src/lint.js";
import { FunctionInfo } from "../src/types.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "fixtures", "sample-project");

describe("lintFunctions", () => {
  const sampleFunc: FunctionInfo = {
    name: "testFunc",
    filePath: path.join(fixturesDir, "src/simple.ts"),
    kind: "function",
    signature: "testFunc(): void",
    interfaces: [],
    types: [],
  };

  it("should return functions unchanged when lint mode is none", async () => {
    const result = await lintFunctions([sampleFunc], "none", fixturesDir);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(sampleFunc);
  });

  it("should return functions unchanged when array is empty", async () => {
    const result = await lintFunctions([], "all", fixturesDir);

    expect(result).toHaveLength(0);
  });

  it("should add lint results with mode all", async () => {
    const lintableFunc: FunctionInfo = {
      name: "hasConsoleLog",
      filePath: path.join(fixturesDir, "src/lintable.ts"),
      kind: "function",
      signature: "hasConsoleLog(): void",
      interfaces: [],
      types: [],
    };

    const result = await lintFunctions([lintableFunc], "all", fixturesDir);

    expect(result).toHaveLength(1);
    expect(result[0].lint).toBeDefined();
    expect(result[0].lint?.mode).toBe("all");
    expect(result[0].lint?.problems).toBeDefined();
  });

  it("should filter only warnings when lint mode is warn", async () => {
    const unusedVarFunc: FunctionInfo = {
      name: "hasUnusedVar",
      filePath: path.join(fixturesDir, "src/lintable.ts"),
      kind: "function",
      signature: "hasUnusedVar(): void",
      interfaces: [],
      types: [],
    };

    const result = await lintFunctions([unusedVarFunc], "warn", fixturesDir);

    expect(result).toHaveLength(1);
    expect(result[0].lint).toBeDefined();
    expect(result[0].lint?.mode).toBe("warn");

    // Should only include warnings, not errors
    const problems = result[0].lint?.problems || [];
    problems.forEach(p => {
      expect(p.severity).toBe("warn");
    });
  });

  it("should include problem details in lint results", async () => {
    const lintableFunc: FunctionInfo = {
      name: "hasConsoleLog",
      filePath: path.join(fixturesDir, "src/lintable.ts"),
      kind: "function",
      signature: "hasConsoleLog(): void",
      interfaces: [],
      types: [],
    };

    const result = await lintFunctions([lintableFunc], "all", fixturesDir);

    expect(result[0].lint?.problems).toBeDefined();
    if (result[0].lint && result[0].lint.problems.length > 0) {
      const problem = result[0].lint.problems[0];
      expect(problem).toHaveProperty("ruleId");
      expect(problem).toHaveProperty("message");
      expect(problem).toHaveProperty("line");
      expect(problem).toHaveProperty("severity");
    }
  });

  it("should handle multiple functions from same file", async () => {
    const func1: FunctionInfo = {
      name: "hasUnusedVar",
      filePath: path.join(fixturesDir, "src/lintable.ts"),
      kind: "function",
      signature: "hasUnusedVar(): void",
      interfaces: [],
      types: [],
    };

    const func2: FunctionInfo = {
      name: "hasConsoleLog",
      filePath: path.join(fixturesDir, "src/lintable.ts"),
      kind: "function",
      signature: "hasConsoleLog(): void",
      interfaces: [],
      types: [],
    };

    const result = await lintFunctions([func1, func2], "all", fixturesDir);

    expect(result).toHaveLength(2);
    expect(result[0].lint).toBeDefined();
    expect(result[1].lint).toBeDefined();
  });

  it("should preserve all function properties", async () => {
    const complexFunc: FunctionInfo = {
      name: "complexFunc",
      filePath: path.join(fixturesDir, "src/simple.ts"),
      kind: "arrow",
      signature: "complexFunc(x: number): string",
      jsDoc: "/** Some docs */",
      interfaces: [{ name: "Foo", text: "interface Foo {}" }],
      types: [{ name: "Bar", text: "type Bar = string;" }],
      subfunctions: [],
    };

    const result = await lintFunctions([complexFunc], "all", fixturesDir);

    expect(result[0].name).toBe(complexFunc.name);
    expect(result[0].kind).toBe(complexFunc.kind);
    expect(result[0].signature).toBe(complexFunc.signature);
    expect(result[0].jsDoc).toBe(complexFunc.jsDoc);
    expect(result[0].interfaces).toEqual(complexFunc.interfaces);
    expect(result[0].types).toEqual(complexFunc.types);
    expect(result[0].subfunctions).toEqual(complexFunc.subfunctions);
    expect(result[0].lint).toBeDefined();
  });
});
