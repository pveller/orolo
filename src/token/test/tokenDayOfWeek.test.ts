import TokenDayOfWeek from '../tokenDayOfWeek';
import TokenTypes from '../types';

test('Token [DAY OF WEEK] has proper type and behavior settings', () => {
  const token = new TokenDayOfWeek(2); // tuesday

  expect(token.type).toEqual(TokenTypes.DAY_OF_WEEK);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([TokenTypes.DIRECTION_WEEK]);
  expect(token.compute()).toMatchObject([]);
  expect(token.isComplete()).toBeFalsy();
});

[-1, 7].forEach(day =>
  test('Token [DAY OF WEEK] will throw if instantiated with a day out of range', () => {
    expect(() => new TokenDayOfWeek(day)).toThrowError();
  })
);
