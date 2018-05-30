import {
  Token,
  TokenDate,
  TokenDayOfMonth,
  TokenDayOfWeek,
  TokenDirectionMonth,
  TokenDirectionWeek,
  TokenDirectionYear,
  TokenEnumeration,
  TokenMonth,
  TokenNamedDay,
  TokenRange,
  TokenTypes
} from './token';

const dayOfWeek: { [name: string]: number } = {
  fri: 5,
  friday: 5,
  mon: 1,
  monday: 1,
  sat: 6,
  saturday: 6,
  sun: 0,
  sunday: 0,
  thu: 4,
  thursday: 4,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3
};

const month: { [name: string]: number } = {
  jan: 1,
  january: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  feb: 2,
  febr: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12
};

const enumeration = [',', 'and'];

const range = ['-', 'till', 'to', 'until', 'through'];

const date = /^\d+[/-]\d+([/-]\d+)?$/;

const namedDays: { [key: string]: number } = {
  today: 0,
  tomorrow: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  tmrw: 1,
  yesterday: -1,
  'day after tomorrow': 2,
  'day before yesterday': -2
};

const spelledOutNumbers: { [key: string]: number } = {
  one: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  first: 1,
  two: 2,
  second: 2,
  three: 3,
  third: 3,
  four: 4,
  five: 5,
  fifth: 5,
  six: 6,
  seven: 7,
  eight: 8,
  eighth: 8,
  nine: 9,
  ninth: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  twelvth: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twentieth: 20,
  twenty: 20,
  thirtieth: 30,
  thirty: 30
};

// ToDo: the week after and the week before are different week after/before next/last.
// week after is an attachable direction that can't be resolved on its own relative to today
// does it attach to another direction_week?

const directionWeek = /^(this|last|past|next|previous)( week)?$|^week (after next)|(before last)$/;
const directionMonth = /^(this|last|past|next|previous) month$/;
const directionYear = /^(this|last|past|next|previous) year$/;

// ToDo: This regex will not detect multi-word spelled out duration as in "twenty five days"
const duration = new RegExp(
  `^(${Object.keys(spelledOutNumbers)
    .concat('\\d+')
    .concat('all', 'entire', 'whole')
    .join('|')}) (day|week|month)s?$`
);

const durationAndDirection = /^(all|entire|whole) (this|last|past|next|previous) (week|month)$/;

const dayOfMonth = new RegExp(
  Object.keys(spelledOutNumbers)
    .map(item => `^${item}(th)?$`)
    .concat('^\\d+(st|nd|rd|th)?$')
    .join('|')
);

const dayOfMonthComposite = /^(twenty|thirty)[ -](\w+)$/;

// ToDo:
// next 5 days
// last two weeks

const durationToToken = (token: string) => {
  return new Token(token, TokenTypes.DURATION);
};

const directionToIncrement = (direction: string): number => {
  if (/last|past|previous/.test(direction)) {
    return -1;
  }
  if (/next/.test(direction)) {
    return 1;
  }

  return 0;
};

const directionToToken = (
  token: string
): TokenDirectionWeek | TokenDirectionMonth | TokenDirectionYear => {
  if (/year/.test(token)) {
    return new TokenDirectionYear(directionToIncrement(token));
  }

  if (/month/.test(token)) {
    return new TokenDirectionMonth(directionToIncrement(token));
  }

  // week
  if (/after next/.test(token)) {
    return new TokenDirectionWeek(2);
  }

  if (/before last/.test(token)) {
    return new TokenDirectionWeek(-2);
  }

  return new TokenDirectionWeek(directionToIncrement(token));
};

export interface IMatcher {
  match(token: string): boolean;
  extract(token: string): Token<any> | Array<Token<any>>;
}

export const matchers: IMatcher[] = [
  {
    extract: (token: string) => new TokenDate(token),
    match: (token: string) => date.test(token)
  },
  {
    extract: (token: string) => new TokenMonth(month[token]),
    match: (token: string) => !!month[token]
  },
  {
    extract: (token: string) => {
      const isNumber = token.match(/^\d+/);
      if (isNumber) {
        return new TokenDayOfMonth(Number(isNumber[0]));
      } else {
        const key = token.replace(/th$/, '');
        return new TokenDayOfMonth(spelledOutNumbers[key]);
      }
    },
    match: (token: string) => dayOfMonth.test(token)
  },
  {
    // ToDo: how is it in other languages ?? any better tools to do this specific language math?
    extract: (token: string) => {
      const match = token.match(dayOfMonthComposite);
      if (match === null) {
        throw new Error(
          `Token ${token} has shown to be a day-of-month-composite but cannot be parsed as such`
        );
      }

      const computed = match
        .slice(1, 3)
        .map(part => spelledOutNumbers[part])
        .reduce((result, el) => result + el, 0);

      return new TokenDayOfMonth(computed);
    },
    match: (token: string) => dayOfMonthComposite.test(token)
  },
  {
    extract: (token: string) => durationToToken(token),
    match: (token: string) => duration.test(token)
  },
  {
    extract: (token: string) => {
      const match = token.match(durationAndDirection);
      if (match === null) {
        throw new Error(
          `Token ${token} has shown to cary duration-and-direction but cannot be parsed as such`
        );
      }

      const durationLiteral = `${match[1]} ${match[3]}`;
      const directionLiteral = `${match[2]} ${match[3]}`;

      return [
        durationToToken(durationLiteral),
        directionToToken(directionLiteral)
      ];
    },
    match: (token: string) => durationAndDirection.test(token)
  },
  {
    extract: (token: string) => new TokenEnumeration(token),
    match: (token: string) => enumeration.includes(token)
  },
  {
    extract: (token: string) => new TokenRange(token),
    match: (token: string) => range.includes(token)
  },
  {
    extract: (token: string) => new TokenDayOfWeek(Number(dayOfWeek[token])),
    match: (token: string) => !!dayOfWeek[token]
  },
  {
    extract: (token: string) => directionToToken(token),
    match: (token: string) =>
      directionWeek.test(token) ||
      directionMonth.test(token) ||
      directionYear.test(token)
  },
  {
    extract: (token: string) => new TokenNamedDay(namedDays[token]),
    match: (token: string) => typeof namedDays[token] !== 'undefined'
  },
  {
    extract: (token: string) => new Token(token, TokenTypes.ANCHOR_START),
    match: (token: string) =>
      /^(starting( on| from)?|leaving( on)?)$/.test(token)
  }
];
