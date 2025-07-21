// src/rules/signal-suggestion.ts
import { Project, SyntaxKind, CallExpression, Node } from "ts-morph";

/**
 * Rule: Suggests using Angular Signals instead of simple RxJS pipe(map()) or pipe(filter()) chains.
 */
export function suggestSignalUsage(filePath: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Skip non-Angular files
  const isAngularFile = sourceFile.getImportDeclarations().some(imp => 
    imp.getModuleSpecifierValue().startsWith('@angular/')
  );
  if (!isAngularFile) return;

  sourceFile.getClasses().forEach(cls => {
    // Only check Angular components/directives/services
    const isAngularClass = cls.getDecorator('Component') || 
                           cls.getDecorator('Directive') || 
                           cls.getDecorator('Injectable');

    if (!isAngularClass) return;

    // Look for pipe(map(...)) or pipe(filter(...))
    cls.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call: CallExpression) => {
      const expr = call.getExpression();

      // Check if this is a pipe call on an Observable
      if (expr.getText().endsWith('.pipe')) {
        const args = call.getArguments();

        const usesMapOrFilter = args.some(arg => {
          return Node.isCallExpression(arg) && 
                 (arg.getExpression().getText() === 'map' || 
                  arg.getExpression().getText() === 'filter');
        });

        if (usesMapOrFilter) {
          const line = call.getStartLineNumber();
          console.log(
            `💡 SIGNAL SUGGESTION in ${filePath}:${line}\n` +
            `   Consider replacing this RxJS chain with Angular Signals or toSignal()\n` +
            `   Example:\n` +
            `     const value = toSignal(this.value$, { initialValue: 0 });\n` +
            `   Docs: https://angular.io/guide/signals `
          );
        }
      }
    });
  });
}