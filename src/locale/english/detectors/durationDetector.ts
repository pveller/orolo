import { Token, TokenTypes } from '../../../token';
import { ITokenDetector } from '../../locale';
import spelledOutNumbers from '../spelledOutNumbers';

// ToDo: This regex will not detect multi-word spelled out duration as in "twenty five days"
const duration = new RegExp(
  `^(${Object.keys(spelledOutNumbers)
    .concat('\\d+')
    .concat('all', 'entire', 'whole')
    .join('|')}) (day|week|month)s?$`
);

export default class EnglishDurationDetector implements ITokenDetector {
  public match(token: string): boolean {
    return duration.test(token);
  }

  public extract(token: string): Token<string> {
    return new Token(token, TokenTypes.DURATION);
  }
}
