// test/reactivelint.test.ts
import { checkUnusedObservables } from "../src/rules/unused-observable";
import { checkImplicitSubscriptions } from "../src/rules/implicit-subscription";
import { suggestSignalUsage } from "../src/rules/signal-suggestion";
import { checkAsyncPipes } from "../src/rules/async-pipe-check";

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});

const testFile = 'test/fixtures/angular-bad-test.ts';

beforeEach(() => {
  consoleWarnMock.mockClear();
  consoleLogMock.mockClear();
});

test('Detects implicit subscriptions', () => {
  checkImplicitSubscriptions(testFile);
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining('ANGULAR SUBSCRIPTION ERROR')
  );
});

test('Detects async pipe without OnPush', () => {
  checkAsyncPipes(testFile);
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining('PERFORMANCE WARNING')
  );
});

test('Suggests Signal usage', () => {
  suggestSignalUsage(testFile);
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining('SIGNAL SUGGESTION')
  );
});

test('Detects unused observables', () => {
  checkUnusedObservables(testFile);
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining('UNUSED OBSERVABLE')
  );
});