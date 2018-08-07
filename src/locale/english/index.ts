import {
  Token,
  TokenDate,
  TokenDirectionMonth,
  TokenDirectionWeek,
  TokenDirectionYear,
  TokenEnumeration,
  TokenRange,
  TokenTypes
} from '../../token';

import { ILocale, ITokenDetector } from '../locale';

import DateDetector from '../detectors/dateDetector';
import EnglishAnchorStartDetector from './detectors/anchorStartDetector';
import EnglishDayOfMonthDetector from './detectors/dayOfMonthDetector';
import EnglishDayOfWeekDetector from './detectors/dayOfWeekDetector';
import EnglishDirectionAndDurationDetector from './detectors/directionAndDurationDetector';
import EnglishDirectionDetector from './detectors/directionDetector';
import EnglishDurationDetector from './detectors/durationDetector';
import EnglishEnumerationDetector from './detectors/enumerationDetector';
import EnglishMonthDetector from './detectors/monthDetector';
import EnglishNamedDayDetector from './detectors/namedDayDetector';
import EnglishRangeDetector from './detectors/rangeDetector';

export class EnglishLocale implements ILocale {
  public readonly splitBy = /[^A-Za-zА-Яа-я0-9/_-]+/;
  public readonly maxNGram = 4;

  public detectors() {
    return [
      new DateDetector(),
      new EnglishAnchorStartDetector(),
      new EnglishDayOfMonthDetector(),
      new EnglishDayOfWeekDetector(),
      new EnglishDirectionAndDurationDetector(),
      new EnglishDirectionDetector(),
      new EnglishDurationDetector(),
      new EnglishEnumerationDetector(),
      new EnglishMonthDetector(),
      new EnglishNamedDayDetector(),
      new EnglishRangeDetector()
    ];
  }
}
