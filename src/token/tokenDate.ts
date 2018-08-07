import { getYear, setDate, setMonth, setYear, startOfDay } from 'date-fns';

import Token from './token';
import TokenTypes from './types';

export default class TokenDate extends Token<string> {
  private year?: number;
  private month: number;
  private date: number;

  constructor(token: string, monthFirst: boolean = true) {
    super(token, TokenTypes.DATE);

    const components = this.token.match(/\d+/g) || [];
    if (![2, 3].includes(components.length)) {
      throw new Error(`TokenDate cannot parse ${token} as a valid date`);
    }

    this.month = Number(components[monthFirst ? 0 : 1]);
    this.date = Number(components[monthFirst ? 1 : 0]);

    if (components.length === 3) {
      if (components[0].length === 4) {
        // YYYY-MM-DD
        this.year = Number(components[0]);
        this.month = Number(components[1]);
        this.date = Number(components[2]);
      } else if ([2, 4].includes(components[2].length)) {
        this.year = Number(components[2]);

        // all double digit yeas are assumed to be in the current millenium
        if (this.year < 100) {
          this.year += 2000;
        }
      } else {
        // we don't use single digit years
        // and this code won't live long enough to see three digit years
        throw new Error(`TokenDate cannot parse ${token} as a valid date`);
      }
    }

    if (this.date < 1 || this.date > 31 || this.month < 1 || this.month > 12) {
      throw new Error(`TokenDate cannot parse ${token} as a valid date`);
    }
  }

  public compute(today = new Date()): Date {
    const year = getYear(today);

    return setDate(
      setMonth(setYear(startOfDay(today), this.year || year), this.month - 1),
      this.date
    );
  }
}
