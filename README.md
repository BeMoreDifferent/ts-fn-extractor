# ts-fn-extractor

**Token-optimized function extraction for AI code reviews in Claude Code.**

Extract precise function information from TypeScript projects without sending entire codebases to AI. Get compact, structured reports perfect for AI analysis, code reviews, and documentation.

## Why This Tool?

When using Claude Code or other AI assistants for code reviews, you face a critical challenge: **token limits**.

Instead of:
- ❌ Sending entire 10,000+ line files
- ❌ Wasting tokens on imports, comments, and boilerplate
- ❌ Hitting context limits with large codebases

You get:
- ✅ **Compact function signatures** and essential context only
- ✅ **90% token reduction** compared to full file analysis
- ✅ **Targeted code reviews** for specific functions
- ✅ **Batch analysis** of multiple functions efficiently

## AI-First Use Cases

### 1. Pre-Review Function Extraction
Extract functions before sending to Claude Code for review:

```bash
# Extract single function for AI review
ts-fn-extractor --fn calculateTotalPrice > review.txt
# Send review.txt to Claude Code (100 tokens vs 5,000+)

# Extract all functions from a module
ts-fn-extractor --file src/payment/processor.ts > functions.txt
# Review each function efficiently
```

### 2. Token-Optimized Code Context
Get just the signature and types without implementation details:

```bash
# Function signature + interfaces + JSDoc only
ts-fn-extractor --fn processUserData
```

**Output (only ~50 tokens):**
```
Function: processUserData
File: src/users/processor.ts
Signature: (user: User, options: ProcessOptions): Promise<ProcessedUser>
Interfaces:
- User: interface User { id: string; email: string; ... }
- ProcessOptions: interface ProcessOptions { validate: boolean; ... }
```

### 3. Function Dependency Analysis
See nested functions and their relationships:

```bash
# Include subfunctions for comprehensive review
ts-fn-extractor --fn complexAlgorithm --with-sub
```

### 4. Automated Code Quality Checks
Combine with ESLint for AI-assisted quality reviews:

```bash
# Get function + lint issues for AI to analyze
ts-fn-extractor --fn handlePayment --lint=all
```

## Installation

```bash
# Using npx (recommended for AI workflows)
npx ts-fn-extractor --fn yourFunction

# Global installation
npm install -g ts-fn-extractor

# In your project
pnpm add -D ts-fn-extractor
```

## Quick Start for Claude Code

### Scenario 1: Review a Specific Function
```bash
# 1. Extract the function
npx ts-fn-extractor --fn authenticateUser > auth-review.txt

# 2. Open Claude Code and paste:
# "Review this function for security issues: [paste auth-review.txt]"
```

### Scenario 2: Batch Review Multiple Functions
```bash
# Extract all functions from a file
npx ts-fn-extractor --file src/api/handlers.ts > handlers.txt

# Claude Code prompt:
# "Review these API handlers for best practices: [paste handlers.txt]"
```

### Scenario 3: Architecture Review
```bash
# Get all functions with their relationships
npx ts-fn-extractor --with-sub > architecture.txt

# Claude Code prompt:
# "Analyze this architecture for potential improvements: [paste architecture.txt]"
```

## CLI Options

| Option | Purpose | AI Use Case |
|--------|---------|-------------|
| `--fn <name>` | Single function | Targeted code review |
| `--file <path>` | All functions in file | Module-level review |
| `--with-sub` | Include nested functions | Dependency analysis |
| `--lint=all` | Include ESLint issues | Quality assessment |
| `--lint=warn` | Warnings only | Pre-commit review |

## Real-World Example

Running on this project itself:

```bash
npx ts-fn-extractor --fn analyzeProject --with-sub
```

**Output (token-optimized for AI):**
```
Function: analyzeProject
File: src/analyzer.ts
Signature: (opts: CliOptions): FunctionInfo[]
JSDoc: -
Interfaces:
- CollectCtx: interface CollectCtx { checker: ts.TypeChecker; ... }
Types: -
Subfunctions:
- collectFunctions (src/analyzer.ts)
Lint: none
```

**Token Comparison:**
- Full file: ~4,500 tokens
- Extracted function: ~150 tokens
- **Savings: 97%**

## AI Workflow Integration

### With Claude Code
```bash
# 1. Extract functions
ts-fn-extractor --file src/complex-module.ts > review.txt

# 2. Open in Claude Code
code review.txt

# 3. Use Claude Code with prompt:
# "@review.txt Suggest improvements for these functions"
```

### With GitHub Copilot
```bash
# Extract function signature for context
ts-fn-extractor --fn myFunction >> .copilot-context
```

### With Cursor AI
```bash
# Generate function summaries for AI reference
ts-fn-extractor > .cursor/functions.md
```

## Output Format

Structured for easy AI parsing:

```
Function: <name>
File: <relative-path>
Signature: <type-signature>
JSDoc: <documentation>
Interfaces: <related-types>
Types: <type-aliases>
Subfunctions: <nested-functions>
Lint: <code-quality-issues>
```

Each section is:
- **Predictable** - Same format every time
- **Parseable** - Easy for AI to understand
- **Compact** - Minimal token usage
- **Complete** - All essential context included

## Features

- 🎯 **Token Optimized** - 90%+ reduction vs full files
- 🤖 **AI-First Design** - Structured output for LLMs
- 📦 **Zero Config** - Works with any TypeScript project
- ⚡ **Fast** - Analyze thousands of functions in seconds
- 🔍 **TypeScript Native** - Uses official Compiler API
- 🎨 **Flexible Filtering** - By file, function, or pattern
- ✅ **ESLint Integration** - Include quality metrics
- 🔄 **Reproducible** - Deterministic output

## Advanced Usage

### Extract Multiple Functions for Batch Review
```bash
# Get all exported functions
ts-fn-extractor > all-functions.txt

# Review in batches with Claude Code
split -l 20 all-functions.txt batch-
# Review each batch-* file separately
```

### Focus on Public API
```bash
# Extract from public-facing files only
ts-fn-extractor --file src/index.ts
ts-fn-extractor --file src/api.ts
```

### Include Code Quality Context
```bash
# Get functions with lint issues for AI to fix
ts-fn-extractor --lint=all > issues.txt
# Prompt: "Fix these ESLint issues: [paste issues.txt]"
```

### Architecture Analysis
```bash
# Extract with subfunctions for structure review
ts-fn-extractor --with-sub > architecture.txt
# Prompt: "Suggest refactoring opportunities: [paste architecture.txt]"
```

## Token Savings Benchmark

Tested on real projects:

| Scenario | Full File | Extracted | Savings |
|----------|-----------|-----------|---------|
| Single function | 5,200 tokens | 180 tokens | 96.5% |
| Module (10 functions) | 12,400 tokens | 850 tokens | 93.1% |
| Complex function + deps | 8,900 tokens | 420 tokens | 95.3% |
| File with interfaces | 6,700 tokens | 320 tokens | 95.2% |

**Average savings: 95%** - Fit 20x more code context in the same token budget!

## Best Practices for AI Code Review

1. **Extract Before Review** - Always get compact function info first
2. **Focus Scope** - Use `--fn` for targeted reviews
3. **Include Context** - Use `--with-sub` for dependent functions
4. **Quality Metrics** - Add `--lint=all` for comprehensive reviews
5. **Batch Process** - Extract multiple functions for sequential review
6. **Save Outputs** - Keep extracts for future reference
7. **Version Control** - Track function signatures over time

## TypeScript Compiler API

Uses official TypeScript compiler for:
- ✅ Accurate type information
- ✅ Project-aware analysis (respects tsconfig.json)
- ✅ Interface and type extraction
- ✅ JSDoc preservation
- ✅ Multi-file navigation

## Requirements

- Node.js ≥18.0.0
- TypeScript project with `tsconfig.json`
- ESLint config (optional, for `--lint` flag)

## Development

```bash
# Clone and setup
git clone https://github.com/BeMoreDifferent/ts-fn-extractor.git
cd ts-fn-extractor
pnpm install

# Run tests (36 tests, full coverage)
pnpm test

# Build
pnpm build

# Test locally
pnpm start -- --fn yourFunction
```

## Links

- **npm:** https://www.npmjs.com/package/ts-fn-extractor
- **GitHub:** https://github.com/BeMoreDifferent/ts-fn-extractor
- **Issues:** https://github.com/BeMoreDifferent/ts-fn-extractor/issues

## License

ISC

---

**Built for AI-assisted development.** Extract smarter, review faster, save tokens.
