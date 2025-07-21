// src/rules/unused-observable.ts
import { Project, VariableDeclaration } from "ts-morph";

/**
 * Rule: Detects unused RxJS Observables in Angular components/services.
 * Ignores observables used with async pipe in templates (not detectable via TS AST).
 */
export function checkUnusedObservables(filePath: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Skip non-Angular files
  const isAngularFile = sourceFile.getImportDeclarations().some(imp => 
    imp.getModuleSpecifierValue().startsWith('@angular/')
  );
  if (!isAngularFile) return;

  // Only check Angular components/directives/services
  const angularClass = sourceFile.getClasses().find(cls => {
    return cls.getDecorator('Component') || cls.getDecorator('Directive') || cls.getDecorator('Injectable');
  });

  if (!angularClass) return;

  // Check property declarations (fields) in the class
  angularClass.getProperties().forEach((property) => {
    const type = property.getType();

    // Use AST to check if it's an RxJS Observable
    if (type.getText().includes('Observable') && 
        type.getSymbol()?.getDeclarations().some(d => 
          d.getSourceFile().getFilePath().toString().includes('node_modules/rxjs')
        )) {
      
      const references = property.findReferencesAsNodes();

      if (references.length === 0) {
        const line = property.getStartLineNumber();
        console.warn(
          `🚨 UNUSED OBSERVABLE in ${filePath}:${line}\n` +
          `   Warning: This Observable is declared but never used in the component.\n` +
          `   Note: Usage in templates (e.g., async pipe) won't be detected here.`
        );
      }
    }
  });
}