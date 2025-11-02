import { FunctionInfo } from "./types.js";
import path from "node:path";

export function formatText(funcs: FunctionInfo[], cwd: string): string {
  const rel = (fp: string) => path.relative(cwd, fp) || fp;
  return funcs
    .map(fn => {
      const header = `Function: ${fn.name}`;
      const file = `File: ${rel(fn.filePath)}`;
      const sig = `Signature: ${fn.signature}`;
      const jsd = fn.jsDoc ? `JSDoc:\n${indent(fn.jsDoc)}` : "JSDoc: -";
      const ifaces =
        fn.interfaces.length > 0
          ? `Interfaces:\n${fn.interfaces.map(i => `- ${i.name}: ${truncate(i.text)}`).join("\n")}`
          : "Interfaces: -";
      const types =
        fn.types.length > 0
          ? `Types:\n${fn.types.map(t => `- ${t.name}: ${truncate(t.text)}`).join("\n")}`
          : "Types: -";
      const sub =
        fn.subfunctions && fn.subfunctions.length
          ? `Subfunctions:\n${fn.subfunctions.map(s => `- ${s.name} (${rel(s.filePath)})`).join("\n")}`
          : "Subfunctions: -";
      const lint =
        fn.lint && fn.lint.problems.length
          ? `Lint (${fn.lint.mode}):\n${fn.lint.problems
              .map(p => `- [${p.severity}] ${p.ruleId ?? "unknown"} @${p.line}: ${p.message}`)
              .join("\n")}`
          : `Lint: ${fn.lint ? fn.lint.mode : "none"}`;

      return [header, file, sig, jsd, ifaces, types, sub, lint].join("\n");
    })
    .join("\n\n");
}

function indent(text: string): string {
  return text
    .split("\n")
    .map(l => "  " + l)
    .join("\n");
}

function truncate(text: string, max = 200): string {
  return text.length > max ? text.slice(0, max) + " ..." : text;
}
