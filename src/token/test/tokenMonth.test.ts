import TokenMonth from '../tokenMonth';
import TokenTypes from '../types';

test('Token [MONTH] has correct type and behavior settings', () => {
  const token = new TokenMonth(1);

  expect(token.type).toEqual(TokenTypes.MONTH);
  expect(token.willAnchor()).toMatchObject([TokenTypes.DAY_OF_MONTH]);
  expect(token.willAttachTo()).toMatchObject([TokenTypes.DIRECTION_YEAR]);
  expect(token.isComplete()).toBeFalsy();
});

test('Token [MONTH] without attachments produces an empty result', () => {
  const token = new TokenMonth(1);

  expect(token.compute()).toMatchObject([]);
});

[-1, 0, 13].forEach(day =>
  test('Token [MONTH] will throw if instantiated with a month out of range', () => {
    expect(() => new TokenMonth(day)).toThrowError();
  })
);
