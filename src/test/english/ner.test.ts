import {
  addDays,
  addWeeks,
  eachDay,
  getYear,
  parse,
  setDay,
  startOfDay
} from 'date-fns';

import { NER } from '../../ner';

const ner = new NER();

test('NER shoudl understand simple named days', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('will be in Dallas tomorrow');

  expect(dates).toMatchObject([addDays(today, 1)]);
});

test('NER should understand simple dates', () => {
  const dates = ner.recognize('will be in Dallas 5/15/18');

  expect(dates).toMatchObject([parse('2018-05-15')]);
});

test('NER shoudl understand simple enumeration', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('will be in Dallas today and tomorrow');

  expect(dates).toMatchObject([today, addDays(today, 1)]);
});

test('NER should understand simple range', () => {
  const year = getYear(new Date());
  const dates = ner.recognize('traveling from 5/15 till 5/17');

  expect(dates).toMatchObject(
    [`${year}-05-15`, `${year}-05-16`, `${year}-05-17`].map(str => parse(str))
  );
});

test('NER should be able to attach tokens', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('in Dubai next week tuesday');

  expect(dates).toMatchObject([setDay(addWeeks(today, 1), 2)]);
});

test('NER should be able to attach tokens over enumeration split', () => {
  const today = startOfDay(new Date());

  const dates = ner.recognize('in Dubai next week tuesday and wednesday');

  expect(dates).toMatchObject([
    setDay(addWeeks(today, 1), 2),
    setDay(addWeeks(today, 1), 3)
  ]);
});

['I am out 5/5, 5/7, and 5/8', 'in NYC May 5th, 7th, and 8th'].forEach(
  utterance =>
    test('NER should properly understand enumeration via a comma', () => {
      const year = getYear(new Date());
      const dates = ner.recognize(utterance);

      expect(dates).toMatchObject(
        [`${year}-05-05`, `${year}-05-07`, `${year}-05-08`].map(str =>
          parse(str)
        )
      );
    })
);

test('NER shoudl udnerstand a range expressed in relative terms', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('last week Thursday till this week Tuesday');

  const start = setDay(addWeeks(today, -1), 4);
  const end = setDay(today, 2);

  expect(dates).toMatchObject(eachDay(start, end));
});

test('NER shoudl understand spelled out dates', () => {
  const year = getYear(new Date());
  const dates = ner.recognize(
    'will be in London from june third till june sixth'
  );

  expect(dates).toMatchObject(
    eachDay(parse(`${year}-06-03`), parse(`${year}-06-06`))
  );
});

test('NER should understand a range with flipped date expressions', () => {
  const year = getYear(new Date());
  const dates = ner.recognize('3rd of March and April 5th');

  expect(dates).toMatchObject(
    [`${year}-03-03`, `${year}-04-05`].map(str => parse(str))
  );
});

test('NER should prioritize closest direction expression', () => {
  const base = addWeeks(startOfDay(new Date()), -1);
  const dates = ner.recognize('I was in SFO this past Tue and Wed');

  expect(dates).toMatchObject([setDay(base, 2), setDay(base, 3)]);
});

test('NER should understand year directions', () => {
  const year = getYear(new Date()) - 1;
  const dates = ner.recognize(
    'I did not go anywhere last year december fifteenth'
  );

  expect(dates).toMatchObject([parse(`${year}-12-15`)]);
});

test('NER should understand formal date formats', () => {
  const year = getYear(new Date());
  const dates = ner.recognize('I am in Dallas on Friday, June 29');
  // In reality, the comma is ignored
  // Friday is a token on its own and it has nothing (no direction) to attach to.
  // So Friday ends up being ignored and 29 will attach to June and compute a date

  // ToDo: do we need matchers and extractors for long formatted dates?
  expect(dates).toMatchObject([parse(`${year}-06-29`)]);
});
