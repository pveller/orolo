import Token from './token';
import TokenTypes from './types';

import { getYear, setYear, startOfDay } from 'date-fns';

import * as _ from 'lodash';
import TokenMonth from './tokenMonth';

export default class TokenDirectionYear extends Token<number> {
  public attachments: TokenMonth[];

  constructor(direction: number) {
    super(direction, TokenTypes.DIRECTION_YEAR);

    this.attachments = [];
  }

  public requiredAttachments() {
    return [TokenTypes.MONTH];
  }

  public compute(today = new Date()) {
    const base = startOfDay(today);

    return _.chain(this.attachments)
      .flatMap(month => month.compute())
      .map(month => setYear(month, getYear(base) + this.token))
      .value();
  }
}
