# ng-reactive-lint 🛠️

<!-- [![JOSS](https://joss.theoj.org/papers/10.21105/joss.XXXXX/status.svg )](https://doi.org/10.21105/joss.XXXXX ) -->
<!-- [![CI](https://github.com/Shrinivassab/ng-reactive-lint/actions/workflows/ci.yml/badge.svg )](https://github.com/Shrinivassab/ng-reactive-lint/actions ) -->

> An Angular-specific linter enforcing optimal reactivity patterns with Signals and RxJS

## Features

- 🛠 **Architecture Guards**  
  - Enforce `takeUntilDestroyed()` for subscription cleanup  
  - Require `OnPush` with `async` pipes  
- ⚡ **Performance Optimizations**  
  - Detect unnecessary change detection triggers  
  - Identify overused RxJS operators  
- 🚦 **Migration Ready**  
  - Suggest Signal conversions for RxJS chains  
  - Highlight deprecated reactivity patterns  

## Installation

### For Angular CLI Projects
```bash
ng add ng-reactive-lint
```

### Standalone Usage

```
npm install -g ng-reactive-lint
```

## Usage

### Basic Linting

Use `npx` to run `reactive-lint` directly after installing it:

```bash
# Lint a specific file
npx reactive-lint src/app/my-component.ts
```

### Lint all TypeScript files in a directory (use quotes for glob patterns)
```
npx reactive-lint "src/app/**/*.ts"
```

### Lint your entire src directory
```
npx reactive-lint "src/**/*.ts"
```

## 🔧 Rules

| Rule ID                   | Description                      | Fixable | Angular-Only |
|---------------------------|----------------------------------|---------|--------------|
| no-implicit-subscriptions | Requires `takeUntilDestroyed()` | ✅      | Yes          |
| no-async-without-onpush   | Flags missing `OnPush`           | ❌      | Yes          |
| prefer-signal             | Suggests Signal conversions      | ✅      | No           |
| no-unused-observables     | Detects unused RxJS streams      | ❌      | No           |

---

## 🚀 Benchmark Results

| Metric                    | Bad Code (Legacy RxJS) | Good Code (Modern Signals) |
|---------------------------|------------------------|----------------------------|
| Linting Time (avg)        | 1.21 s                 | 1.86 s                     |
| Memory Usage              | 152 MB                 | 251 MB                     |

> ⚠️ Note: The "good" code uses modern Angular patterns (`toSignal`, `effect`) which involve deeper AST structures and more reactive expressions. This naturally increases parsing time but reflects real-world adoption of Signals. The linter scales robustly with complexity.

# 🚀 Development

## Build
```bash
npm run build
```

## Test
```bash
npm test
```

## Run on Example Files
```
npm run lint-example
```

## 🤝 Contributing

PRs welcome! See our [Contribution Guide](https://contributing.md/how-to-build-contributing-md/).

## 📄 License

MIT © [Shrinivass Arunachalam Balasubramanian](https://github.com/Shrinivassab/ng-reactive-lint/blob/main/LICENSE )