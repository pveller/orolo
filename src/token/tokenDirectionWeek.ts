import Token from './token';
import TokenTypes from './types';

import { addWeeks, setDay, startOfDay } from 'date-fns';

import * as _ from 'lodash';
import TokenDayOfWeek from './tokenDayOfWeek';

export default class TokenDirectionWeek extends Token<number> {
  public attachments: TokenDayOfWeek[];

  constructor(direction: number) {
    super(direction, TokenTypes.DIRECTION_WEEK);

    this.attachments = [];
  }

  public requiredAttachments() {
    return [TokenTypes.DAY_OF_WEEK];
  }

  public compute(today = new Date()) {
    const base = startOfDay(today);

    return _.chain(this.attachments)
      .flatMap(day => day.token)
      .map(day => addWeeks(setDay(base, day), this.token))
      .value();
  }
}
