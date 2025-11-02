import { analyzeProject } from "./analyzer.js";
import { lintFunctions } from "./lint.js";
import { formatText } from "./formatter.js";
import { CliOptions } from "./types.js";

export async function runExtractor(opts: CliOptions): Promise<string> {
  const analyzed = analyzeProject(opts);
  const withLint = await lintFunctions(analyzed, opts.lintMode, opts.cwd);
  return formatText(withLint, opts.cwd);
}
