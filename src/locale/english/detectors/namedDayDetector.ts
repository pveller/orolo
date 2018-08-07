import { TokenNamedDay } from '../../../token';
import { ITokenDetector } from '../../locale';

const namedDays: { [key: string]: number } = {
  today: 0,
  tomorrow: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  tmrw: 1,
  yesterday: -1,
  'day after tomorrow': 2,
  'day before yesterday': -2
};

export default class EnglishNamedDayDetector implements ITokenDetector {
  public match(token: string): boolean {
    return typeof namedDays[token] !== 'undefined';
  }

  public extract(token: string): TokenNamedDay {
    return new TokenNamedDay(namedDays[token]);
  }
}
