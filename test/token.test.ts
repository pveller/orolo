import {
  Token,
  TokenDate,
  TokenDayOfMonth,
  TokenDayOfWeek,
  TokenDirectionWeek,
  TokenDirectionYear,
  TokenEnumeration,
  TokenMonth,
  TokenNamedDay,
  TokenTypes
} from '../src/token';

import { addDays, parse, startOfDay } from 'date-fns';

test('Default token settings and behavior', () => {
  const token = new Token('something');

  expect(token.type).toEqual(TokenTypes.UNDEFINED);
  expect(token.compute()).toMatchObject([]);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
});

test('Token [DATE] has correct type and behavior settings', () => {
  const token = new TokenDate('5/15');

  expect(token.type).toEqual(TokenTypes.DATE);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
});

['5/15', '05/15/2018', '2018-05-15'].forEach(date =>
  test(`Token [DATE] properly computes itself for [${date}]`, () => {
    const token = new TokenDate(date);

    expect(token.compute()).toEqual(startOfDay(new Date('05/15/2018')));
  })
);

test('Token [NAMED DAY] has correct type and behavior settings', () => {
  const token = new TokenNamedDay(+1);

  expect(token.type).toEqual(TokenTypes.NAMED_DAY);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
});

const days: { [key: string]: number } = {
  'day after tomorrow': 2,
  'day before yesterday': -2,
  tmrw: 1,
  today: 0,
  tomorrow: 1,
  yesterday: -1
};

Object.keys(days).forEach(day =>
  test('Token [NAMED DAY] can compute itself', () => {
    const token = new TokenNamedDay(days[day]);
    const expected = addDays(startOfDay(new Date()), days[day]);

    expect(token.compute()).toEqual(expected);
  })
);

// ToDo: assumed DIRECTION_YEAR = THIS YEAR ??

test('Token [MONTH] has correct type and behavior settings', () => {
  const token = new TokenMonth(1);

  expect(token.type).toEqual(TokenTypes.MONTH);
  expect(token.willAnchor()).toMatchObject([TokenTypes.DAY_OF_MONTH]);
  expect(token.willAttachTo()).toMatchObject([TokenTypes.DIRECTION_YEAR]);
});

test('Token [MONTH] without attachments produces an empty result', () => {
  const token = new TokenMonth(1);

  expect(token.compute()).toMatchObject([]);
});

test('Token [DIRECTION WEEK] has proper type and behavior settings', () => {
  const token = new TokenDirectionWeek(+1); // next week

  expect(token.type).toEqual(TokenTypes.DIRECTION_WEEK);
  expect(token.willAnchor()).toMatchObject([TokenTypes.DAY_OF_WEEK]);
  expect(token.willAttachTo()).toMatchObject([]);
});

test('Token [DIRECTION WEEK] without attachments produces an empty result', () => {
  const token = new TokenDirectionWeek(+1); // next week

  expect(token.compute()).toMatchObject([]);
});

test('Token [DIRECTION YEAR] has proper type and behavior settings', () => {
  const token = new TokenDirectionYear(+1); // next year

  expect(token.type).toEqual(TokenTypes.DIRECTION_YEAR);
  expect(token.willAnchor()).toMatchObject([TokenTypes.MONTH]);
  expect(token.willAttachTo()).toMatchObject([]);
});

test('Token [DIRECTION YEAR] without attachments produces an empty result', () => {
  const token = new TokenDirectionYear(+1); // next year

  expect(token.compute()).toMatchObject([]);
});

test('Token [DAY OF MONTH] has proper type and behavior settings', () => {
  const token = new TokenDayOfMonth(15);

  expect(token.type).toEqual(TokenTypes.DAY_OF_MONTH);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([
    TokenTypes.MONTH,
    TokenTypes.DIRECTION_MONTH
  ]);
  expect(token.compute()).toMatchObject([]);
});

test('MONTH + DAY (+ YEAR) will compute a date', () => {
  const year = new TokenDirectionYear(-1); // last year
  const month = new TokenMonth(12);
  const day = new TokenDayOfMonth(15);

  month.attach(day);
  year.attach(month);

  expect(month.compute()).toMatchObject([startOfDay(parse('2018-12-15'))]);
  expect(year.compute()).toMatchObject([startOfDay(parse('2017-12-15'))]);
});

test('Token [DAY OF WEEK] has proper type and behavior settings', () => {
  const token = new TokenDayOfWeek(2); // tuesday

  expect(token.type).toEqual(TokenTypes.DAY_OF_WEEK);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([TokenTypes.DIRECTION_WEEK]);
  expect(token.compute()).toMatchObject([]);
});

test('Token [ENUMERATION] has proper type and behavior settings', () => {
  const token = new TokenEnumeration('and'); // tuesday

  expect(token.type).toEqual(TokenTypes.ENUMERATION);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
});

test('Token [ENUMERATION] will never accept attachments', () => {
  const enumeration = new TokenEnumeration('and');
  const day = new TokenDayOfWeek(2);

  expect(enumeration.attach(new Token('something'))).toBeFalsy();
  expect(enumeration.attach(day)).toBeFalsy();
  expect(enumeration.attach(new TokenDayOfMonth(15))).toBeFalsy();
});
