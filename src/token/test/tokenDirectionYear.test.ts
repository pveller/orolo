import TokenDirectionYear from '../tokenDirectionYear';
import TokenTypes from '../types';

test('Token [DIRECTION YEAR] has proper type and behavior settings', () => {
  const token = new TokenDirectionYear(+1); // next year

  expect(token.type).toEqual(TokenTypes.DIRECTION_YEAR);
  expect(token.willAnchor()).toMatchObject([TokenTypes.MONTH]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.isComplete()).toBeFalsy();
});

test('Token [DIRECTION YEAR] without attachments produces an empty result', () => {
  const token = new TokenDirectionYear(+1); // next year

  expect(token.compute()).toMatchObject([]);
});
