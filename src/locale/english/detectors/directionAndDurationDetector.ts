import {
  Token,
  TokenDirectionMonth,
  TokenDirectionWeek,
  TokenDirectionYear,
  TokenTypes
} from '../../../token';

import { ITokenDetector } from '../../locale';
import { directionToToken } from './directionDetector';

const durationAndDirection = /^(all|entire|whole) (this|last|past|next|previous) (week|month)$/;

export default class EnglishDirectionAndDurationDetector
  implements ITokenDetector {
  public match(token: string): boolean {
    return durationAndDirection.test(token);
  }

  public extract(token: string) {
    const match = token.match(durationAndDirection);
    if (match === null) {
      throw new Error(
        `Token ${token} has shown to cary duration-and-direction but cannot be parsed as such`
      );
    }

    const durationLiteral = `${match[1]} ${match[3]}`;
    const directionLiteral = `${match[2]} ${match[3]}`;

    return [
      new Token(durationLiteral, TokenTypes.DURATION),
      directionToToken(directionLiteral)
    ];
  }
}
