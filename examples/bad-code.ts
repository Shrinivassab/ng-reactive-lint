// examples/bad-code.ts
import { of } from 'rxjs';

// Unused Observable (should trigger warning)
const unusedData = of(1, 2, 3); // This line should be in your example

// examples/bad-code.ts
import { interval } from 'rxjs';

// Implicit subscription (no cleanup)
interval(1000).subscribe(console.log); // This should trigger the warning

// examples/bad-code.ts
import { map } from 'rxjs/operators';

// Add this for Signal suggestion test
const mappedData = of(1, 2, 3).pipe(
  map(x => x * 2) // Should trigger signal suggestion
);