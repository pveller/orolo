import { TokenDate } from '../../token';
import { ITokenDetector } from '../locale';

/*
  will support the following formats:
    2018-01-01
    5/15/2018
    4/14/18
    5-15-18
    20.12.2017
    6/6
 */
const isDate = /^\d+\/\d+(\/\d+)?$|^\d+-\d+(-\d+)?$|^\d+\.\d+(\.\d+)?$/;

export default class DateDetector implements ITokenDetector {
  private readonly monthFirst: boolean;

  constructor(monthFirst: boolean = true) {
    this.monthFirst = monthFirst;
  }

  public match(token: string) {
    return isDate.test(token);
  }
  public extract(token: string): TokenDate {
    return new TokenDate(token, this.monthFirst);
  }
}
