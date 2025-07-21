// src/rules/implicit-subscription.ts
import { Project, SyntaxKind, CallExpression } from "ts-morph";

/**
 * Rule: Detects subscriptions in Angular components/directives that are not cleaned up.
 * Suggests using `takeUntilDestroyed()` or `takeUntil` with ngOnDestroy.
 */
export function checkImplicitSubscriptions(filePath: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Only analyze Angular files
  const isAngularFile = sourceFile.getImportDeclarations().some(imp =>
    imp.getModuleSpecifierValue().startsWith('@angular/')
  );
  if (!isAngularFile) return;

  sourceFile.getClasses().forEach(cls => {
    const isComponent = !!cls.getDecorator('Component');
    const isDirective = !!cls.getDecorator('Directive');
    if (!isComponent && !isDirective) return;

    // Track whether ngOnDestroy exists
    const hasNgOnDestroy = cls.getMethods().some(m => m.getName() === 'ngOnDestroy');

    // Check all methods for subscriptions
    cls.getMethods().forEach(method => {
      const methodName = method.getName();

      method.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call: CallExpression) => {
        const exprText = call.getExpression().getText();

        if (exprText.endsWith('.subscribe')) {
          const isInNgOnDestroy = methodName === 'ngOnDestroy';
          const usesTakeUntil = call.getText().includes('takeUntil');
          const usesTakeUntilDestroyed = call.getText().includes('takeUntilDestroyed');

          const isSafe = isInNgOnDestroy || usesTakeUntil || usesTakeUntilDestroyed;

          if (!isSafe) {
            const line = call.getStartLineNumber();
            console.warn(
              `🛑 ANGULAR SUBSCRIPTION ERROR in ${filePath}:${line}\n` +
              `   Fix: Use takeUntilDestroyed() or ngOnDestroy with takeUntil()\n` +
              `   Suggestion: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';\n` +
              `   Example: https://angular.io/guide/signals#unsubscribing`
            );
          }
        }
      });
    });
  });
}