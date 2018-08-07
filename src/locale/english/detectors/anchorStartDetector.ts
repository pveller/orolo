import { Token, TokenTypes } from '../../../token';
import { ITokenDetector } from '../../locale';

export default class EnglishAnchorStartDetector implements ITokenDetector {
  public extract(token: string) {
    return new Token(token, TokenTypes.ANCHOR_START);
  }
  public match(token: string) {
    return /^(starting( on| from)?|leaving( on)?)$/.test(token);
  }
}
