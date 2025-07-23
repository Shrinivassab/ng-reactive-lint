import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { interval, map, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodComponent {
  // Proper effect cleanup
  constructor() {
    effect((onCleanup) => {
      const sub = interval(1000).subscribe();
      onCleanup(() => sub.unsubscribe());
    });
  }

  // Signal instead of observable
  data = toSignal(of('Hello'));

  // Signal with RxJS conversion
  count = toSignal(interval(1000).pipe(map(n => n * 2)));

  // Unused signal (explicit)
  private unused = signal([1, 2, 3]);
}