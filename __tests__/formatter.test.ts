import { formatText } from "../src/formatter.js";
import { FunctionInfo } from "../src/types.js";
import path from "node:path";

describe("formatText", () => {
  const cwd = "/test/project";

  it("should format a simple function without optional fields", () => {
    const func: FunctionInfo = {
      name: "testFunc",
      filePath: path.join(cwd, "src/test.ts"),
      kind: "function",
      signature: "testFunc(): void",
      interfaces: [],
      types: [],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("Function: testFunc");
    expect(result).toContain("File: src/test.ts");
    expect(result).toContain("Signature: testFunc(): void");
    expect(result).toContain("JSDoc: -");
    expect(result).toContain("Interfaces: -");
    expect(result).toContain("Types: -");
    expect(result).toContain("Subfunctions: -");
    expect(result).toContain("Lint: none");
  });

  it("should format a function with JSDoc", () => {
    const func: FunctionInfo = {
      name: "documentedFunc",
      filePath: path.join(cwd, "src/docs.ts"),
      kind: "function",
      signature: "documentedFunc(x: number): string",
      jsDoc: "/**\n * Test documentation\n * @param x - A number\n */",
      interfaces: [],
      types: [],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("Function: documentedFunc");
    expect(result).toContain("JSDoc:\n  /**");
    expect(result).toContain("  * Test documentation");
  });

  it("should format a function with interfaces and types", () => {
    const func: FunctionInfo = {
      name: "typedFunc",
      filePath: path.join(cwd, "src/types.ts"),
      kind: "function",
      signature: "typedFunc(param: MyInterface): MyType",
      interfaces: [
        { name: "MyInterface", text: "interface MyInterface { id: number; }" },
      ],
      types: [{ name: "MyType", text: "type MyType = string | number;" }],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("Interfaces:\n- MyInterface: interface MyInterface { id: number; }");
    expect(result).toContain("Types:\n- MyType: type MyType = string | number;");
  });

  it("should format a function with subfunctions", () => {
    const subFunc: FunctionInfo = {
      name: "innerFunc",
      filePath: path.join(cwd, "src/nested.ts"),
      kind: "arrow",
      signature: "innerFunc(): void",
      interfaces: [],
      types: [],
    };

    const func: FunctionInfo = {
      name: "outerFunc",
      filePath: path.join(cwd, "src/nested.ts"),
      kind: "function",
      signature: "outerFunc(): void",
      interfaces: [],
      types: [],
      subfunctions: [subFunc],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("Subfunctions:\n- innerFunc (src/nested.ts)");
  });

  it("should format a function with lint warnings", () => {
    const func: FunctionInfo = {
      name: "lintedFunc",
      filePath: path.join(cwd, "src/lint.ts"),
      kind: "function",
      signature: "lintedFunc(): void",
      interfaces: [],
      types: [],
      lint: {
        mode: "warn",
        problems: [
          {
            ruleId: "no-unused-vars",
            message: "Variable 'x' is never used",
            line: 10,
            severity: "warn",
          },
        ],
      },
    };

    const result = formatText([func], cwd);

    expect(result).toContain("Lint (warn):");
    expect(result).toContain("- [warn] no-unused-vars @10: Variable 'x' is never used");
  });

  it("should format multiple functions separated by blank lines", () => {
    const func1: FunctionInfo = {
      name: "func1",
      filePath: path.join(cwd, "src/file1.ts"),
      kind: "function",
      signature: "func1(): void",
      interfaces: [],
      types: [],
    };

    const func2: FunctionInfo = {
      name: "func2",
      filePath: path.join(cwd, "src/file2.ts"),
      kind: "arrow",
      signature: "func2(): void",
      interfaces: [],
      types: [],
    };

    const result = formatText([func1, func2], cwd);

    expect(result).toContain("Function: func1");
    expect(result).toContain("Function: func2");
    expect(result.split("\n\n").length).toBeGreaterThan(1);
  });

  it("should truncate long interface/type definitions", () => {
    const longText = "a".repeat(250);
    const func: FunctionInfo = {
      name: "longFunc",
      filePath: path.join(cwd, "src/long.ts"),
      kind: "function",
      signature: "longFunc(): void",
      interfaces: [{ name: "LongInterface", text: longText }],
      types: [],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("...");
    expect(result).not.toContain(longText);
  });

  it("should handle empty function list", () => {
    const result = formatText([], cwd);
    expect(result).toBe("");
  });

  it("should show relative paths from cwd", () => {
    const func: FunctionInfo = {
      name: "relativeFunc",
      filePath: path.join(cwd, "deeply/nested/path/file.ts"),
      kind: "function",
      signature: "relativeFunc(): void",
      interfaces: [],
      types: [],
    };

    const result = formatText([func], cwd);

    expect(result).toContain("File: deeply/nested/path/file.ts");
  });
});
