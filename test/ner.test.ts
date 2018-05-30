import {
  addDays,
  addWeeks,
  eachDay,
  parse,
  setDay,
  startOfDay
} from 'date-fns';

import * as ner from '../src/ner';

test('NER v2 shoudl understand simple named days', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('will be in Dallas tomorrow');

  expect(dates).toMatchObject([addDays(today, 1)]);
});

test('NER v2 shoudl understand simple dates', () => {
  const dates = ner.recognize('will be in Dallas 5/15/18');

  expect(dates).toMatchObject([parse('2018-05-15')]);
});

test('NER v2 shoudl understand simple enumeration', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('will be in Dallas today and tomorrow');

  expect(dates).toMatchObject([today, addDays(today, 1)]);
});

test('NER v2 should understand simple range', () => {
  const dates = ner.recognize('traveling from 5/15 till 5/17');

  expect(dates).toMatchObject(
    ['2018-05-15', '2018-05-16', '2018-05-17'].map(str => parse(str))
  );
});

test('NER v2 should be able to attach tokens', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('in Dubai next week tuesday');

  expect(dates).toMatchObject([setDay(addWeeks(today, 1), 2)]);
});

test('NER v2 should be able to attach tokens over enumeration split', () => {
  const today = startOfDay(new Date());

  const dates = ner.recognize('in Dubai next week tuesday and wednesday');

  expect(dates).toMatchObject([
    setDay(addWeeks(today, 1), 2),
    setDay(addWeeks(today, 1), 3)
  ]);
});

['I am out 5/5, 5/7, and 5/8', 'in NYC May 5th, 7th, and 8th'].forEach(
  utterance =>
    test('NER v2 should properly understand enumeration via a comma', () => {
      const dates = ner.recognize(utterance);

      expect(dates).toMatchObject(
        ['2018-05-05', '2018-05-07', '2018-05-08'].map(str => parse(str))
      );
    })
);

test('NER v2 shoudl udnerstand a range expressed in relative terms', () => {
  const today = startOfDay(new Date());
  const dates = ner.recognize('last week Thursday till this week Tuesday');

  const start = setDay(addWeeks(today, -1), 4);
  const end = setDay(today, 2);

  expect(dates).toMatchObject(eachDay(start, end));
});

test('NER v2 shoudl understand spelled out dates', () => {
  const dates = ner.recognize(
    'will be in London from june third till june sixth'
  );

  expect(dates).toMatchObject(
    eachDay(parse('2018-06-03'), parse('2018-06-06'))
  );
});

test('NER v2 should understand a range with flipped date expressions', () => {
  const dates = ner.recognize('3rd of March and April 5th');

  expect(dates).toMatchObject(
    ['2018-03-03', '2018-04-05'].map(str => parse(str))
  );
});

test('NER v2 should prioritize closest direction expression', () => {
  const base = addWeeks(startOfDay(new Date()), -1);
  const dates = ner.recognize('I was in SFO this past Tue and Wed');

  expect(dates).toMatchObject([setDay(base, 2), setDay(base, 3)]);
});

test('NER v2 should understand year directions', () => {
  const dates = ner.recognize(
    'I did not go anywhere last year december fifteenth'
  );

  expect(dates).toMatchObject([parse('2017-12-15')]);
});
