"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test/reactivelint.test.ts
const unused_observable_1 = require("../rules/unused-observable");
const implicit_subscription_1 = require("../rules/implicit-subscription");
const signal_suggestion_1 = require("../rules/signal-suggestion");
const async_pipe_check_1 = require("../rules/async-pipe-check");
const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => { });
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => { });
describe('ReactiveLint Rules', () => {
    const angularExample = 'examples/angular-bad-code.ts';
    const standardExample = 'examples/bad-code.ts';
    beforeEach(() => {
        consoleWarnMock.mockClear();
        consoleLogMock.mockClear();
    });
    test('Detects unused observables (Angular)', () => {
        (0, unused_observable_1.checkUnusedObservables)(angularExample);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Unused Observable'));
    });
    test('Detects implicit subscriptions (Angular)', () => {
        (0, implicit_subscription_1.checkImplicitSubscriptions)(angularExample);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Angular: Implicit subscription'));
    });
    test('Suggests Signal usage (Angular)', () => {
        (0, signal_suggestion_1.suggestSignalUsage)(angularExample);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Consider using Signals'));
    });
    test('Checks async pipes (Angular)', () => {
        (0, async_pipe_check_1.checkAsyncPipes)(angularExample);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Async pipe detected without OnPush'));
    });
    test('Detects implicit subscriptions (Standard)', () => {
        (0, implicit_subscription_1.checkImplicitSubscriptions)(standardExample);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Standard: Implicit subscription'));
    });
});
