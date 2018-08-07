import TokenDirectionMonth from '../tokenDirectionMonth';
import TokenTypes from '../types';

test('Token [DIRECTION MONTH] has proper type and behavior settings', () => {
  const token = new TokenDirectionMonth(+1); // next month

  expect(token.type).toEqual(TokenTypes.DIRECTION_MONTH);
  expect(token.willAnchor()).toMatchObject([TokenTypes.DAY_OF_MONTH]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.isComplete()).toBeFalsy();
});

test('Token [DIRECTION MONTH] without attachments produces an empty result', () => {
  const token = new TokenDirectionMonth(+1); // next month

  expect(token.compute()).toMatchObject([]);
});
