import { TokenMonth } from '../../../token';
import { ITokenDetector } from '../../locale';

const months: { [name: string]: number } = {
  jan: 1,
  january: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  feb: 2,
  febr: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12
};

export default class EnglishMonthDetector implements ITokenDetector {
  public match(token: string): boolean {
    return !!months[token];
  }

  public extract(token: string): TokenMonth {
    return new TokenMonth(months[token]);
  }
}
