// D:\Coding Examples\reactive-lint\examples\angular-bad-code.ts
import { Component, OnInit } from '@angular/core'; // Import Angular core
import { Observable, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  // Include a template using async pipe to trigger the async pipe check
  template: `<div>{{ data$ | async }}</div>`
})
export class BadComponent implements OnInit { // Implement OnInit
  // Example 1: Implicit subscription without cleanup (should trigger checkImplicitSubscriptions)
  ngOnInit() {
    interval(1000).subscribe(console.log); // No takeUntil, not in ngOnDestroy
  }

  // Example 2: Observable used with async pipe but no OnPush (should trigger checkAsyncPipes)
  // Make sure ChangeDetectionStrategy.OnPush is NOT present in the @Component decorator above
  data$: Observable<string> = of('Hello');

  // Example 3: Simple RxJS chain suitable for Signal replacement (should trigger suggestSignalUsage)
  count$ = interval(1000).pipe(map(n => n * 2));

  // Example 4: Observable declared but never used (should trigger checkUnusedObservables)
  private unused$ = of(1, 2, 3);
}

// // examples/angular-bad-code.ts
// import { Component, signal } from '@angular/core';
// import { Observable, of, interval } from 'rxjs';
// import { map } from 'rxjs/operators';

// /***************************
//  * SCENARIO 1: Implicit subscriptions without cleanup
//  ***************************/
// @Component({})
// export class SubscriptionComponent {
//   ngOnInit() {
//     // ❌ Should trigger: "Use takeUntilDestroyed()"
//     interval(1000).subscribe();
//   }
// }

// /***************************
//  * SCENARIO 2: Async pipe without OnPush
//  ***************************/
// @Component({
//   template: `<div>{{ data | async }}</div>`,
//   // ❌ Missing: changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class AsyncPipeComponent {
//   data: Observable<string> = of('Hello');
// }

// /***************************
//  * SCENARIO 3: RxJS chains replaceable with Signals
//  ***************************/
// @Component({})
// export class RxjsSignalComponent {
//   // ❌ Should suggest: "Use signal() + effect()"
//   count$ = interval(1000).pipe(map(n => n * 2));
// }

// /***************************
//  * SCENARIO 4: Unused observables
//  ***************************/
// @Component({})
// export class UnusedObservableComponent {
//   // ❌ Should warn: "Unused Observable: 'unusedData$'"
//   private unusedData$: Observable<number> = of(1, 2, 3);
// }