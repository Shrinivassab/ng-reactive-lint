// test/reactivelint.test.ts
import { checkUnusedObservables } from "../rules/unused-observable";
import { checkImplicitSubscriptions } from "../rules/implicit-subscription";
import { suggestSignalUsage } from "../rules/signal-suggestion";
import { checkAsyncPipes } from "../rules/async-pipe-check";

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ReactiveLint Rules', () => {
  const angularExample = 'examples/angular-bad-code.ts';
  const standardExample = 'examples/bad-code.ts';

  beforeEach(() => {
    consoleWarnMock.mockClear();
    consoleLogMock.mockClear();
  });

  test('Detects unused observables (Angular)', () => {
    checkUnusedObservables(angularExample);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Unused Observable')
    );
  });

  test('Detects implicit subscriptions (Angular)', () => {
    checkImplicitSubscriptions(angularExample);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Angular: Implicit subscription')
    );
  });

  test('Suggests Signal usage (Angular)', () => {
    suggestSignalUsage(angularExample);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Consider using Signals')
    );
  });

  test('Checks async pipes (Angular)', () => {
    checkAsyncPipes(angularExample);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Async pipe detected without OnPush')
    );
  });

  test('Detects implicit subscriptions (Standard)', () => {
    checkImplicitSubscriptions(standardExample);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Standard: Implicit subscription')
    );
  });
});