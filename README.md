# ts-fn-extractor

A CLI tool that scans TypeScript projects, extracts function information, and prints compact reports.

## Installation

```bash
# Using npm
npm install -g ts-fn-extractor

# Using npx (no installation required)
npx ts-fn-extractor
```

## Quick Start

```bash
# Scan all functions in your TypeScript project
ts-fn-extractor

# Find a specific function
ts-fn-extractor --fn myFunction

# Analyze a specific file
ts-fn-extractor --file src/utils.ts
```

## Development Setup

```bash
# Clone and install dependencies
git clone https://github.com/BeMoreDifferent/ts-fn-extractor.git
cd ts-fn-extractor
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

## What It Does

Analyzes TypeScript projects and extracts:
- Functions, methods, arrow functions, and function expressions
- JSDoc comments and signatures
- Associated interfaces and type aliases
- Nested subfunctions (optional)
- ESLint problems (optional)

## Features

- **TypeScript Compiler API**: Project-aware AST traversal
- **Multiple function types**: Regular functions, methods, arrows, function expressions
- **Type information**: Captures interfaces and types from the same file
- **JSDoc extraction**: Preserves documentation
- **Subfunctions**: Optional recursive extraction
- **ESLint integration**: Optional linting with configurable modes
- **Fast filtering**: By file or function name

## Usage Examples

```bash
# Scan all functions in your project
npx ts-fn-extractor

# Find a specific function
npx ts-fn-extractor --fn getUserById

# Analyze a specific file
npx ts-fn-extractor --file src/user/service.ts

# Include nested subfunctions
npx ts-fn-extractor --fn processData --with-sub

# Run with ESLint (warnings only)
npx ts-fn-extractor --file src/api.ts --lint=warn

# Run with ESLint (all problems)
npx ts-fn-extractor --file src/api.ts --lint=all

# Combine options
npx ts-fn-extractor --file src/service.ts --with-sub --lint=all
```

## CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--file <path>` | Filter to specific file | `--file src/utils.ts` |
| `--fn <name>` | Filter to function name | `--fn getUserById` |
| `--with-sub` | Include subfunctions | `--with-sub` |
| `--lint=<mode>` | Lint mode: `none`, `warn`, `all` | `--lint=all` |

## Output Format

Each function is reported with structured information:

```text
Function: runExtractor
File: src/index.ts
Signature: (opts: CliOptions): Promise<string>
JSDoc: -
Interfaces: -
Types: -
Subfunctions: -
Lint: none
```

When running with `--with-sub` on a function with nested functions:

```text
Function: analyzeProject
File: src/analyzer.ts
Signature: (opts: CliOptions): FunctionInfo[]
Interfaces:
- CollectCtx: interface CollectCtx { checker: ts.TypeChecker; ... }
Types: -
Subfunctions:
- collectFunctions (src/analyzer.ts)
Lint: none
```

## Development

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Build
pnpm build

# Run CLI locally
pnpm start -- --fn yourFunction
```

## How It Works

1. **analyzer.ts** - Uses TypeScript Compiler API for AST traversal
2. **formatter.ts** - Formats function data into readable text
3. **lint.ts** - Integrates ESLint for code quality checks
4. **index.ts** - Orchestrates all modules
5. **cli.ts** - Handles command-line interface

## Testing

Built with test-driven development:
- 36 tests covering all modules
- Test fixtures in `__tests__/fixtures/`
- Full coverage of analyzer, formatter, lint, and integration

## Requirements

- Node.js (ES2022+)
- TypeScript 5.6+
- ESLint 9+
- pnpm

## Notes

- Requires `tsconfig.json` in your project
- Loads ESLint config from your project (if using `--lint`)
- File-level lint results (functions in same file share messages)
- Filter by file/function for better performance on large projects

## License

ISC
