import { setDate, setMonth, startOfDay } from 'date-fns';
import * as _ from 'lodash';

import Token from './token';
import TokenDayOfMonth from './tokenDayOfMonth';
import TokenDirectionYear from './tokenDirectionYear';
import TokenTypes from './types';

export default class TokenMonth extends Token<number> {
  public attachments: TokenDayOfMonth[];
  public anchor?: TokenDirectionYear;

  /* from 1 (january) to 12 (december) */
  constructor(month: number) {
    if (month < 1 || month > 12) {
      throw new Error(
        `TokenMonth can only accept an integer in the range [1, 12] as a token. Received ${month}`
      );
    }

    super(month, TokenTypes.MONTH);

    this.attachments = [];
  }

  public requiredAttachments() {
    return [TokenTypes.DAY_OF_MONTH];
  }

  public willAttachTo() {
    return [TokenTypes.DIRECTION_YEAR];
  }

  public compute(today = new Date()) {
    // we count month 1 to 12 and Date counts them 0 to 11
    const base = setMonth(startOfDay(today), this.token - 1);

    return _.chain(this.attachments)
      .flatMap(date => date.token)
      .map(date => setDate(base, date))
      .value();
  }
}
