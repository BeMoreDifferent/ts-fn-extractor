import ts from "typescript";
import path from "node:path";
import { CliOptions, FunctionInfo } from "./types.js";

interface CollectCtx {
  checker: ts.TypeChecker;
  sourceFile: ts.SourceFile;
  filePath: string;
  includeSubs: boolean;
  interfaces: Array<{ name: string; text: string }>;
  types: Array<{ name: string; text: string }>;
}

export function analyzeProject(opts: CliOptions): FunctionInfo[] {
  const configPath = ts.findConfigFile(opts.cwd, ts.sys.fileExists, "tsconfig.json");
  if (!configPath) {
    throw new Error("tsconfig.json not found in " + opts.cwd);
  }
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
  const program = ts.createProgram({ rootNames: parsed.fileNames, options: parsed.options });
  const checker = program.getTypeChecker();

  const results: FunctionInfo[] = [];

  for (const sf of program.getSourceFiles()) {
    const filePath = path.resolve(sf.fileName);
    if (!filePath.startsWith(opts.cwd)) continue;
    if (opts.file && !filePath.endsWith(opts.file)) continue;

    const interfaces = collectInterfaces(sf);
    const types = collectTypes(sf);

    const ctx: CollectCtx = {
      checker,
      sourceFile: sf,
      filePath,
      includeSubs: opts.withSubfunctions,
      interfaces,
      types
    };

    const collectFunctions = (node: ts.Node) => {
      const fi = toFunctionInfo(node, ctx);
      if (fi) {
        if (!opts.functionName || fi.name === opts.functionName) {
          results.push(fi);
        }
      }

      // Recurse into class declarations to find methods
      if (ts.isClassDeclaration(node)) {
        ts.forEachChild(node, collectFunctions);
      }
    };

    ts.forEachChild(sf, collectFunctions);
  }

  return results;
}

function toFunctionInfo(node: ts.Node, ctx: CollectCtx): FunctionInfo | undefined {
  if (ts.isFunctionDeclaration(node) && node.name) {
    return buildFunctionInfo(node.name.text, node, ctx, "function");
  }
  if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
    return buildFunctionInfo(node.name.text, node, ctx, "method");
  }
  if (ts.isVariableStatement(node)) {
    const decl = node.declarationList.declarations[0];
    if (decl && ts.isIdentifier(decl.name) && decl.initializer && ts.isArrowFunction(decl.initializer)) {
      return buildFunctionInfo(decl.name.text, decl.initializer, ctx, "arrow");
    }
    if (decl && ts.isIdentifier(decl.name) && decl.initializer && ts.isFunctionExpression(decl.initializer)) {
      return buildFunctionInfo(decl.name.text, decl.initializer, ctx, "function-expression");
    }
  }
  return undefined;
}

function buildFunctionInfo(
  name: string,
  node: ts.SignatureDeclarationBase | ts.FunctionLikeDeclarationBase,
  ctx: CollectCtx,
  kind: FunctionInfo["kind"]
): FunctionInfo {
  const signature = ctx.checker.getSignatureFromDeclaration(node as ts.SignatureDeclaration);
  const sigText = signature ? ctx.checker.signatureToString(signature) : node.getText();
  const jsDoc = extractJsDoc(node);
  const subfunctions = ctx.includeSubs ? collectSubfunctions(node, ctx) : undefined;

  return {
    name,
    kind,
    filePath: ctx.filePath,
    signature: sigText,
    jsDoc,
    interfaces: ctx.interfaces,
    types: ctx.types,
    subfunctions
  };
}

function collectSubfunctions(root: ts.Node, ctx: CollectCtx): FunctionInfo[] {
  const subs: FunctionInfo[] = [];
  const walk = (node: ts.Node) => {
    if (node === root) {
      ts.forEachChild(node, walk);
      return;
    }
    const fi = toFunctionInfo(node, ctx);
    if (fi) {
      subs.push(fi);
    }
    ts.forEachChild(node, walk);
  };
  walk(root);
  return subs;
}

function collectInterfaces(sf: ts.SourceFile) {
  const items: Array<{ name: string; text: string }> = [];
  sf.forEachChild(node => {
    if (ts.isInterfaceDeclaration(node)) {
      items.push({ name: node.name.text, text: node.getText() });
    }
  });
  return items;
}

function collectTypes(sf: ts.SourceFile) {
  const items: Array<{ name: string; text: string }> = [];
  sf.forEachChild(node => {
    if (ts.isTypeAliasDeclaration(node)) {
      items.push({ name: node.name.text, text: node.getText() });
    }
  });
  return items;
}

function extractJsDoc(node: ts.Node): string | undefined {
  const jsDocs = ts.getJSDocCommentsAndTags(node);
  if (!jsDocs?.length) return;
  return jsDocs
    .map(d => d.getText())
    .join("\n")
    .trim();
}
