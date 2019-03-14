import { addMonths, getYear, parse, setDate, startOfDay } from 'date-fns';
import {
  TokenDayOfMonth,
  TokenDirectionMonth,
  TokenDirectionYear,
  TokenMonth
} from '../';

test('MONTH + DAY (+ YEAR) will compute a date', () => {
  const now = getYear(new Date());

  const year = new TokenDirectionYear(-1); // last year
  const month = new TokenMonth(12);
  const day = new TokenDayOfMonth(15);

  month.attach(day);
  year.attach(month);

  expect(month.compute()).toMatchObject([startOfDay(parse(`${now}-12-15`))]);
  expect(year.compute()).toMatchObject([startOfDay(parse(`${now - 1}-12-15`))]);
});

test('MONTH DIRECTION + DAY will compute a date', () => {
  const today = startOfDay(new Date());

  const month = new TokenDirectionMonth(+1); // next month
  const day = new TokenDayOfMonth(15);
  month.attach(day);

  expect(month.compute(today)).toMatchObject([
    setDate(addMonths(today, 1), 15)
  ]);
});

test('completeness of a token will change as it receives required attachments/anchors', () => {
  const month = new TokenMonth(12);
  const day = new TokenDayOfMonth(15);

  expect(month.isComplete()).toBeFalsy();
  month.attach(day);
  expect(month.isComplete()).toBeTruthy();
});

test('completeness of a token will change as it receives required anchors', () => {
  const month = new TokenDirectionMonth(+1);
  const day = new TokenDayOfMonth(15);

  expect(day.isComplete()).toBeFalsy();
  month.attach(day);
  expect(day.isComplete()).toBeTruthy();
});
