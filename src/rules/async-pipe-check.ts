// src/rules/async-pipe-check.ts
import { Project, SyntaxKind } from "ts-morph";

export function checkAsyncPipes(filePath: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  sourceFile.getClasses().forEach(cls => {
    const componentDecorator = cls.getDecorator("Component");
    if (!componentDecorator) return;

    const metadata = componentDecorator.getArguments()[0];
    const usesOnPush = metadata?.getText().includes("ChangeDetectionStrategy.OnPush");
    const hasAsyncPipe = metadata?.getText().includes("async");

    if (hasAsyncPipe && !usesOnPush) {
      const line = componentDecorator.getStartLineNumber();
      console.warn(
        `⚡ PERFORMANCE WARNING in ${filePath}:${line}\n` +
        `   Using 'async' pipe without OnPush change detection\n` +
        `   Suggestion: Add OnPush to @Component:\n` +
        `     changeDetection: ChangeDetectionStrategy.OnPush`
      );
    }
  });
}