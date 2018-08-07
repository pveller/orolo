import {
  TokenDirectionMonth,
  TokenDirectionWeek,
  TokenDirectionYear
} from '../../../token';

import { ITokenDetector } from '../../locale';

// ToDo: the week after and the week before are different than week after/before next/last.
// "the week after/before" is an attachable direction that can't be resolved on its own relative to today

const directionWeek = /^(this|last|past|next|previous)( week)?$|^week (after next)|(before last)$/;
const directionMonth = /^(this|last|past|next|previous) month$/;
const directionYear = /^(this|last|past|next|previous) year$/;

const directionToIncrement = (direction: string): number => {
  if (/last|past|previous/.test(direction)) {
    return -1;
  }
  if (/next/.test(direction)) {
    return 1;
  }

  return 0;
};

const directionToToken = (token: string) => {
  if (/year/.test(token)) {
    return new TokenDirectionYear(directionToIncrement(token));
  }

  if (/month/.test(token)) {
    return new TokenDirectionMonth(directionToIncrement(token));
  }

  if (/after next/.test(token)) {
    return new TokenDirectionWeek(2);
  }

  if (/before last/.test(token)) {
    return new TokenDirectionWeek(-2);
  }

  return new TokenDirectionWeek(directionToIncrement(token));
};

export default class EnglishDirectionDetector implements ITokenDetector {
  public extract(
    token: string
  ): TokenDirectionWeek | TokenDirectionMonth | TokenDirectionYear {
    return directionToToken(token);
  }

  public match(token: string): boolean {
    return (
      directionWeek.test(token) ||
      directionMonth.test(token) ||
      directionYear.test(token)
    );
  }
}

export { directionToToken };
