import { TokenEnumeration } from '../../../token';
import { ITokenDetector } from '../../locale';

export default class EnglishEnumerationDetector implements ITokenDetector {
  public match(token: string) {
    return [',', 'and'].includes(token);
  }
  public extract(token: string): TokenEnumeration {
    return new TokenEnumeration(token);
  }
}
