import { addDays, startOfDay } from 'date-fns';

import Token from './token';
import TokenTypes from './types';

export default class TokenNamedDay extends Token<number> {
  constructor(token: number) {
    super(token, TokenTypes.NAMED_DAY);
  }

  public compute(today = new Date()) {
    const base = startOfDay(today);

    return addDays(base, this.token);
  }
}
