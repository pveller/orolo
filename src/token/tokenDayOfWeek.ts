import Token from './token';
import TokenDirectionWeek from './tokenDirectionWeek';
import TokenTypes from './types';

export default class TokenDayOfWeek extends Token<number> {
  public anchor?: TokenDirectionWeek;

  /* from 0 (sunday) to 6 (saturday) */
  constructor(day: number) {
    if (day < 0 || day > 6) {
      throw new Error(
        `TokenDayOfWeek can only accept an integer in the range [0, 6] as a token. Received ${day}`
      );
    }

    super(day, TokenTypes.DAY_OF_WEEK);
  }

  public requiredAnchors() {
    return [TokenTypes.DIRECTION_WEEK];
  }
}
