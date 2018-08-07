import { TokenDayOfWeek } from '../../../token';
import { ITokenDetector } from '../../locale';

const daysOfTheWeek: { [name: string]: number } = {
  fri: 5,
  friday: 5,
  mon: 1,
  monday: 1,
  sat: 6,
  saturday: 6,
  sun: 0,
  sunday: 0,
  thu: 4,
  thursday: 4,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3
};

export default class EnglishDayOfWeekDetector implements ITokenDetector {
  public match(token: string): boolean {
    return !!daysOfTheWeek[token];
  }

  public extract(token: string): TokenDayOfWeek {
    return new TokenDayOfWeek(Number(daysOfTheWeek[token]));
  }
}
