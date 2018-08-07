import { addDays, startOfDay } from 'date-fns';

import TokenNamedDay from '../tokenNamedDay';
import TokenTypes from '../types';

test('Token [NAMED DAY] has correct type and behavior settings', () => {
  const token = new TokenNamedDay(+1);

  expect(token.type).toEqual(TokenTypes.NAMED_DAY);
  expect(token.willAnchor()).toMatchObject([]);
  expect(token.willAttachTo()).toMatchObject([]);
  expect(token.isComplete()).toBeTruthy();
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
