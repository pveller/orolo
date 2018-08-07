// ToDo: need to cover the entire matcher with tests
// ToDo: do we need named matchers? like TokenType-to-Matcher map? Otherwise tests are not deterministic

import { TokenDayOfMonth, TokenTypes } from '../../../token';
import { EnglishLocale } from '../index';

const locale = new EnglishLocale();

Object.entries({
  '1': ['one', 'first'],
  '2': ['two', 'second'],
  '3': ['three', 'third'],
  '4': ['four', 'fourth']
}).forEach(testcase =>
  test(`Day of Month parser should understand all variations of ${
    testcase[0]
  }`, () => {
    const days = testcase[1].concat(testcase[0]);
    const expected = Number(testcase[0]);

    days.forEach(day => {
      const detector = locale.detectors().find(d => d.match(day));

      expect(detector).not.toBeNull();

      if (detector) {
        const token = detector.extract(day) as TokenDayOfMonth;
        expect(token.type).toEqual(TokenTypes.DAY_OF_MONTH);
        expect(token.token).toEqual(expected);
      } else {
        throw new Error('Detector should not be null');
      }
    });
  })
);
