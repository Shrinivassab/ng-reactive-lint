"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// examples/bad-code.ts
const rxjs_1 = require("rxjs");
// Unused Observable (should trigger warning)
const unusedData = (0, rxjs_1.of)(1, 2, 3); // This line should be in your example
// examples/bad-code.ts
const rxjs_2 = require("rxjs");
// Implicit subscription (no cleanup)
(0, rxjs_2.interval)(1000).subscribe(console.log); // This should trigger the warning
// examples/bad-code.ts
const operators_1 = require("rxjs/operators");
// Add this for Signal suggestion test
const mappedData = (0, rxjs_1.of)(1, 2, 3).pipe((0, operators_1.map)(x => x * 2) // Should trigger signal suggestion
);
