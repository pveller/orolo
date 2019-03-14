import { getYear, parse, startOfDay } from 'date-fns';

import TokenDate from '../tokenDate';
import TokenTypes from '../types';

test('Token [DATE] has correct type and behavior settings', () => {
  const token = new TokenDate('5/15');

  expect(token.type).toEqual(TokenTypes.DATE);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.isComplete()).toBeTruthy();
});

['05/15/2018', '2018-05-15'].forEach(date =>
  test(`Token [DATE] properly computes itself for [${date}]`, () => {
    const token = new TokenDate(date);

    expect(token.compute()).toEqual(startOfDay(new Date('05/15/2018')));
  })
);

test(`Token [DATE] properly computes itself for [05/15]`, () => {
  const now = getYear(new Date());
  const token = new TokenDate('05/15');

  expect(token.compute()).toEqual(startOfDay(new Date(`05/15/${now}`)));
})

test('Token [DATE] can understand dates in DD/MM format', () => {
  const token = new TokenDate('2/3/18', false);

  expect(token.compute()).toEqual(parse('2018-03-02'));
});

['not a date', '25', '28-28-115', '2.3.3', '13/13/2018'].forEach(date =>
  test(`Token [DATE] will throw an Error on [${date}]`, () => {
    expect(() => {
      const token = new TokenDate(date);
    }).toThrowError();
  })
);
