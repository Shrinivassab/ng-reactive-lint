"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnusedObservableComponent = exports.RxjsSignalComponent = exports.AsyncPipeComponent = exports.SubscriptionComponent = void 0;
// examples/angular-bad-code.ts
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/***************************
 * SCENARIO 1: Implicit subscriptions without cleanup
 ***************************/
let SubscriptionComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SubscriptionComponent = _classThis = class {
        ngOnInit() {
            // ❌ Should trigger: "Use takeUntilDestroyed()"
            (0, rxjs_1.interval)(1000).subscribe();
        }
    };
    __setFunctionName(_classThis, "SubscriptionComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionComponent = _classThis;
})();
exports.SubscriptionComponent = SubscriptionComponent;
/***************************
 * SCENARIO 2: Async pipe without OnPush
 ***************************/
let AsyncPipeComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            template: `<div>{{ data | async }}</div>`,
            // ❌ Missing: changeDetection: ChangeDetectionStrategy.OnPush
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AsyncPipeComponent = _classThis = class {
        constructor() {
            this.data = (0, rxjs_1.of)('Hello');
        }
    };
    __setFunctionName(_classThis, "AsyncPipeComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AsyncPipeComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AsyncPipeComponent = _classThis;
})();
exports.AsyncPipeComponent = AsyncPipeComponent;
/***************************
 * SCENARIO 3: RxJS chains replaceable with Signals
 ***************************/
let RxjsSignalComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RxjsSignalComponent = _classThis = class {
        constructor() {
            // ❌ Should suggest: "Use signal() + effect()"
            this.count$ = (0, rxjs_1.interval)(1000).pipe((0, operators_1.map)(n => n * 2));
        }
    };
    __setFunctionName(_classThis, "RxjsSignalComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RxjsSignalComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RxjsSignalComponent = _classThis;
})();
exports.RxjsSignalComponent = RxjsSignalComponent;
/***************************
 * SCENARIO 4: Unused observables
 ***************************/
let UnusedObservableComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UnusedObservableComponent = _classThis = class {
        constructor() {
            // ❌ Should warn: "Unused Observable: 'unusedData$'"
            this.unusedData$ = (0, rxjs_1.of)(1, 2, 3);
        }
    };
    __setFunctionName(_classThis, "UnusedObservableComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UnusedObservableComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UnusedObservableComponent = _classThis;
})();
exports.UnusedObservableComponent = UnusedObservableComponent;
