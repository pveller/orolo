import Token from './token';
import TokenTypes from './types';

import { addMonths, setDate, startOfDay } from 'date-fns';
import * as _ from 'lodash';

import TokenDayOfMonth from './tokenDayOfMonth';

export default class TokenDirectionMonth extends Token<number> {
  public attachments: TokenDayOfMonth[];

  constructor(direction: number) {
    super(direction, TokenTypes.DIRECTION_MONTH);

    this.attachments = [];
  }

  public requiredAttachments() {
    return [TokenTypes.DAY_OF_MONTH];
  }

  public compute(today = new Date()) {
    const base = startOfDay(today);

    return _.chain(this.attachments)
      .flatMap(date => date.token)
      .map(date => addMonths(setDate(base, date), this.token))
      .value();
  }
}
