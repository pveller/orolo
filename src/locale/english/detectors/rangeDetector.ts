import { TokenRange } from '../../../token';
import { ITokenDetector } from '../../locale';

export default class EnglishRangeDetector implements ITokenDetector {
  public match(token: string) {
    return ['-', 'till', 'to', 'until', 'through'].includes(token);
  }

  public extract(token: string): TokenRange {
    return new TokenRange(token);
  }
}
