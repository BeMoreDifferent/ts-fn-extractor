export type LintMode = "none" | "warn" | "all";

export interface CliOptions {
  cwd: string;
  file?: string;
  functionName?: string;
  withSubfunctions: boolean;
  lintMode: LintMode;
}

export interface FunctionInfo {
  name: string;
  filePath: string;
  kind: "function" | "method" | "arrow" | "function-expression";
  signature: string;
  jsDoc?: string;
  interfaces: Array<{ name: string; text: string }>;
  types: Array<{ name: string; text: string }>;
  subfunctions?: FunctionInfo[];
  lint?: {
    mode: LintMode;
    problems: Array<{ ruleId: string | null; message: string; line: number; severity: "warn" | "error" }>;
  };
}
