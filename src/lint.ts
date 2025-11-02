import { ESLint } from "eslint";
import { FunctionInfo, LintMode } from "./types.js";

export async function lintFunctions(funcs: FunctionInfo[], mode: LintMode, cwd: string): Promise<FunctionInfo[]> {
  if (mode === "none" || funcs.length === 0) return funcs;
  const eslint = new ESLint({ cwd });
  const fileSet = Array.from(new Set(funcs.map(f => f.filePath)));
  const results = await eslint.lintFiles(fileSet);

  const byFile = new Map<string, ESLint.LintResult>();
  for (const r of results) {
    byFile.set(r.filePath, r);
  }

  return funcs.map(fn => {
    const res = byFile.get(fn.filePath);
    const msgs = res?.messages ?? [];
    const filtered =
      mode === "warn"
        ? msgs.filter(m => m.severity === 1).map(m => ({
            ruleId: m.ruleId,
            message: m.message,
            line: m.line,
            severity: "warn" as const
          }))
        : msgs.map(m => ({
            ruleId: m.ruleId,
            message: m.message,
            line: m.line,
            severity: m.severity === 1 ? "warn" as const : "error" as const
          }));
    return {
      ...fn,
      lint: {
        mode,
        problems: filtered
      }
    };
  });
}
