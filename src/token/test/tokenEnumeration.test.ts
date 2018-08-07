import Token from '../token';
import TokenDayOfMonth from '../tokenDayOfMonth';
import TokenDayOfWeek from '../tokenDayOfWeek';
import TokenEnumeration from '../tokenEnumeration';
import TokenTypes from '../types';

test('Token [ENUMERATION] has proper type and behavior settings', () => {
  const token = new TokenEnumeration('and');

  expect(token.type).toEqual(TokenTypes.ENUMERATION);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
  // enumeration will never compute. it's a separator
  expect(token.isComplete()).toBeTruthy();
  expect(token.compute(new Date())).toMatchObject([]);
});

test('Token [ENUMERATION] will never accept attachments', () => {
  const enumeration = new TokenEnumeration('and');
  const day = new TokenDayOfWeek(2);

  expect(enumeration.attach(new Token('something'))).toBeFalsy();
  expect(enumeration.attach(day)).toBeFalsy();
  expect(enumeration.attach(new TokenDayOfMonth(15))).toBeFalsy();
});
