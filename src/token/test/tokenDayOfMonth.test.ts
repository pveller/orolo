import TokenDayOfMonth from '../tokenDayOfMonth';
import TokenTypes from '../types';

test('Token [DAY OF MONTH] has proper type and behavior settings', () => {
  const token = new TokenDayOfMonth(15);

  expect(token.type).toEqual(TokenTypes.DAY_OF_MONTH);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([
    TokenTypes.MONTH,
    TokenTypes.DIRECTION_MONTH
  ]);
  expect(token.compute()).toMatchObject([]);
  expect(token.isComplete()).toBeFalsy();
});

[-1, 0, 32].forEach(day =>
  test('Token [DAY OF MONTH] will throw if instantiated with a day out of range', () => {
    expect(() => new TokenDayOfMonth(day)).toThrowError();
  })
);
