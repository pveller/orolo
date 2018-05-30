import Token from './token';
import TokenDirectionMonth from './tokenDirectionMonth';
import TokenMonth from './tokenMonth';
import TokenTypes from './types';

import { addMonths, setDate, startOfDay } from 'date-fns';

export default class TokenDayOfMonth extends Token<number> {
  public anchor?: TokenMonth | TokenDirectionMonth;

  /* from 1 to 31 */
  constructor(day: number) {
    if (day < 1 || day > 31) {
      throw new Error(
        `TokenDayOfMonth can only accept an integer in the range [1, 31] as a token. Received ${day}`
      );
    }

    super(day, TokenTypes.DAY_OF_MONTH);
  }

  public requiredAnchors() {
    return [TokenTypes.MONTH, TokenTypes.DIRECTION_MONTH];
  }
}
