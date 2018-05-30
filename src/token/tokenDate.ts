import { getYear, parse, setYear } from 'date-fns';

import Token from './token';
import TokenTypes from './types';

export default class TokenDate extends Token<string> {
  constructor(token: string) {
    super(token, TokenTypes.DATE);
  }

  public compute(today = new Date()): Date {
    const date = parse(this.token);

    // check if the date has a full year
    if (/\d+[/-]\d+[/-]\d+|\d{4}/.test(this.token)) {
      return date;
    }

    return setYear(date, getYear(today));
  }
}
