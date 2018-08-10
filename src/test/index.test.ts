import Orolo, * as everything from '../index';

test('Orolo should export Orolo as a default export', () => {
  expect(Orolo).toBeDefined();
  expect(Orolo).toBe(everything.Orolo);
});

test('Orolo should export Orolo', () => {
  expect(everything.Orolo).toBeDefined();
});

test('Orolo should export EnglishLocale', () => {
  expect(everything.EnglishLocale).toBeDefined();
});

test('Orolo should export the underlying parse abstractions', () => {
  expect(everything.parse).toBeDefined();
  expect(everything.Sequence).toBeDefined();
});
