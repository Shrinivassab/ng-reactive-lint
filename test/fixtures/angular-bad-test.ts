// test/fixtures/angular-bad-test.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: `<div>{{ data$ | async }}</div>`,
  // No OnPush
})
export class BadComponent implements OnInit, OnDestroy {
  // Implicit subscription
  ngOnInit() {
    interval(1000).subscribe();
  }

  ngOnDestroy() {
    // No cleanup
  }

  // Async pipe without OnPush
  data$: Observable<string> = of('Hello');

  // RxJS chain replaceable with Signals
  count$ = interval(1000).pipe(map(n => n * 2));

  // Unused observable
  private unused$ = of(1, 2, 3);
}