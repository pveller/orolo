import { TokenDayOfMonth } from '../../../token';
import { ITokenDetector } from '../../locale';
import spelledOutNumbers from '../spelledOutNumbers';

const dayOfMonth = new RegExp(
  Object.keys(spelledOutNumbers)
    .map(item => `^${item}(th)?$`)
    .concat('^\\d+(st|nd|rd|th)?$')
    .join('|')
);

const dayOfMonthComposite = /^(twenty|thirty)[ -](\w+)$/;

const extractSingle = (token: string): TokenDayOfMonth => {
  const isNumber = token.match(/^\d+/);
  if (isNumber) {
    return new TokenDayOfMonth(Number(isNumber[0]));
  }

  // e.g. thirteenth => thirteen
  const key = token.replace(/th$/, '');
  return new TokenDayOfMonth(spelledOutNumbers[key]);
};

const extractComposite = (token: string): TokenDayOfMonth => {
  const match = token.match(dayOfMonthComposite);
  if (match === null) {
    throw new Error(
      `Token ${token} has shown to be a day-of-month-composite but cannot be parsed as such`
    );
  }

  const computed = match
    .slice(1, 3)
    .map(part => spelledOutNumbers[part])
    .reduce((result, el) => result + el, 0);

  return new TokenDayOfMonth(computed);
};

export default class EnglishDayOfMonthDetector implements ITokenDetector {
  public match(token: string): boolean {
    return dayOfMonth.test(token) || dayOfMonthComposite.test(token);
  }

  public extract(token: string): TokenDayOfMonth {
    return dayOfMonth.test(token)
      ? extractSingle(token)
      : extractComposite(token);
  }
}
