import TokenDirectionWeek from '../tokenDirectionWeek';
import TokenTypes from '../types';

test('Token [DIRECTION WEEK] has proper type and behavior settings', () => {
  const token = new TokenDirectionWeek(+1); // next week

  expect(token.type).toEqual(TokenTypes.DIRECTION_WEEK);
  expect(token.willAnchor()).toMatchObject([TokenTypes.DAY_OF_WEEK]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.isComplete()).toBeFalsy();
});

test('Token [DIRECTION WEEK] without attachments produces an empty result', () => {
  const token = new TokenDirectionWeek(+1); // next week

  expect(token.compute()).toMatchObject([]);
});
