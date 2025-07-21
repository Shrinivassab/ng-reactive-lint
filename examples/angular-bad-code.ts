// examples/angular-bad-code.ts
import { Component, signal } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';

/***************************
 * SCENARIO 1: Implicit subscriptions without cleanup
 ***************************/
@Component({})
export class SubscriptionComponent {
  ngOnInit() {
    // ❌ Should trigger: "Use takeUntilDestroyed()"
    interval(1000).subscribe();
  }
}

/***************************
 * SCENARIO 2: Async pipe without OnPush
 ***************************/
@Component({
  template: `<div>{{ data | async }}</div>`,
  // ❌ Missing: changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncPipeComponent {
  data: Observable<string> = of('Hello');
}

/***************************
 * SCENARIO 3: RxJS chains replaceable with Signals
 ***************************/
@Component({})
export class RxjsSignalComponent {
  // ❌ Should suggest: "Use signal() + effect()"
  count$ = interval(1000).pipe(map(n => n * 2));
}

/***************************
 * SCENARIO 4: Unused observables
 ***************************/
@Component({})
export class UnusedObservableComponent {
  // ❌ Should warn: "Unused Observable: 'unusedData$'"
  private unusedData$: Observable<number> = of(1, 2, 3);
}