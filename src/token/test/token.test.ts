import { Token, TokenTypes } from '../';

test('Default token settings and behavior', () => {
  const token = new Token('something');

  expect(token.type).toEqual(TokenTypes.UNDEFINED);
  expect(token.compute()).toMatchObject([]);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.requiredAnchors()).toMatchObject([]);
  expect(token.requiredAttachments()).toMatchObject([]);
  expect(token.isComplete()).toBeTruthy();
});
