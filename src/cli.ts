#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { runExtractor } from "./index.js";
import { LintMode } from "./types.js";

(async () => {
  const args = process.argv.slice(2);
  const cwd = process.cwd();

  const file = readFlag(args, "--file");
  const functionName = readFlag(args, "--fn");
  const withSubfunctions = args.includes("--with-sub");
  const lintFlag = (readFlag(args, "--lint") ?? "none") as LintMode;

  const out = await runExtractor({
    cwd,
    file: file ? path.normalize(file) : undefined,
    functionName: functionName ?? undefined,
    withSubfunctions,
    lintMode: lintFlag
  });

  process.stdout.write(out + "\n");
})().catch(err => {
  process.stderr.write(String(err?.message ?? err) + "\n");
  process.exit(1);
});

function readFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1) return;
  return args[idx + 1];
}
