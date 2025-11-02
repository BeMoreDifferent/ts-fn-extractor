# ts-fn-extractor

A CLI tool that scans TypeScript projects, extracts function information, and prints compact reports.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run on your TypeScript project
npx ts-fn-extractor

# Or run tests
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

For each function, the tool outputs:

```text
Function: functionName
File: relative/path/to/file.ts
Signature: functionName(param: Type): ReturnType
JSDoc:
  /** JSDoc comments if present */
Interfaces:
- InterfaceName: interface definition...
Types:
- TypeName: type definition...
Subfunctions:
- subFunctionName (relative/path/to/file.ts)
Lint: mode
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
