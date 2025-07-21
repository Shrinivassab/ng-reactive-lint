// src/rules/async-pipe-check.ts
import { Project, SyntaxKind, VariableDeclaration, PropertyAccessExpression, Node } from "ts-morph";

/**
 * Rule: Detects usage of the `async` pipe without `OnPush` change detection.
 * Suggestion: Add `changeDetection: ChangeDetectionStrategy.OnPush` to `@Component`.
 */
export function checkAsyncPipes(filePath: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  sourceFile.getClasses().forEach(cls => {
    const componentDecorator = cls.getDecorator("Component");
    if (!componentDecorator) return;

    const metadata = componentDecorator.getArguments()[0];
    const usesOnPush = metadata?.getText().includes("ChangeDetectionStrategy.OnPush");

    // Get all variable declarations in the class
    cls.forEachDescendant((node) => {
      if (Node.isVariableDeclaration(node)) {
        const varType = node.getType().getText();
        if (varType.includes("Observable")) {
          // Find all references to this variable
          node.findReferencesAsNodes().forEach((ref) => {
            const isAsyncPipe = ref
              .getParentIfKind(SyntaxKind.PropertyAccessExpression)
              ?.getText()
              .includes("async");

            if (isAsyncPipe && !usesOnPush) {
              const line = ref.getStartLineNumber();
              console.warn(
                `⚡ PERFORMANCE WARNING in ${filePath}:${line}\n` +
                `   Using 'async' pipe without OnPush change detection\n` +
                `   Suggestion: Add OnPush to @Component:\n` +
                `     changeDetection: ChangeDetectionStrategy.OnPush`
              );
            }
          });
        }
      }
    });
  });
}