import { EnglishLocale } from '../../locale/english';
import { parse } from '../../parser';
import { TokenTypes } from '../../token';

const locale = new EnglishLocale();

test('Parser should parse properly formatted dates', () => {
  const tokenized = parse('12/15/18', locale).raw(false);
  const expected = [
    {
      token: '12/15/18',
      type: TokenTypes.DATE
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should parse months and single dates', () => {
  const tokenized = parse('in NYC on April the 5th', locale).raw(false);
  const expected = [
    {
      token: 4,
      type: TokenTypes.MONTH
    },
    {
      token: 5,
      type: TokenTypes.DAY_OF_MONTH
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should see ranges and enumerations', () => {
  const tokenized = parse('in NYC 5/15 - 5/18 and 5/20', locale).raw(false);
  const expected = [
    {
      token: '5/15',
      type: TokenTypes.DATE
    },
    {
      token: '-',
      type: TokenTypes.RANGE
    },
    {
      token: '5/18',
      type: TokenTypes.DATE
    },
    {
      token: 'and',
      type: TokenTypes.ENUMERATION
    },
    {
      token: '5/20',
      type: TokenTypes.DATE
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should see days of week and direction', () => {
  const tokenized = parse(
    'was in London last week Wed through Friday',
    locale
  ).raw(false);
  const expected = [
    {
      token: -1,
      type: TokenTypes.DIRECTION_WEEK
    },
    {
      token: 3,
      type: TokenTypes.DAY_OF_WEEK
    },
    {
      token: 'through',
      type: TokenTypes.RANGE
    },
    {
      token: 5,
      type: TokenTypes.DAY_OF_WEEK
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should see spelled out days', () => {
  const tokenized = parse('in new york on may twenty fifth', locale).raw(false);
  const expected = [
    {
      token: 5,
      type: TokenTypes.MONTH
    },
    {
      token: 25,
      type: TokenTypes.DAY_OF_MONTH
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should understand named days', () => {
  const tokenized = parse('in London today and tomorrow', locale).raw(false);
  const expected = [
    {
      token: 0,
      type: TokenTypes.NAMED_DAY
    },
    {
      token: 'and',
      type: TokenTypes.ENUMERATION
    },
    {
      token: 1,
      type: TokenTypes.NAMED_DAY
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Parser should understand durations', () => {
  const tokenized = parse('I will in Dubai next two weeks', locale).raw(false);
  const expected = [
    {
      token: 1,
      type: TokenTypes.DIRECTION_WEEK
    },
    {
      token: 'two weeks',
      type: TokenTypes.DURATION
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

test('Tokenizer shoud understand starting anchors', () => {
  const tokenized = parse('in Australlia for 2 weeks starting Thu', locale).raw(
    false
  );
  const expected = [
    {
      token: '2 weeks',
      type: TokenTypes.DURATION
    },
    {
      token: 'starting',
      type: TokenTypes.ANCHOR_START
    },
    {
      token: 4,
      type: TokenTypes.DAY_OF_WEEK
    }
  ];

  expect(tokenized).toMatchObject(expected);
});

[
  'will be in Dallas all next week',
  'will be in Dallas all week next week'
].forEach(token =>
  test(`Parser should understand a combination of duration and direction in [${token}]`, () => {
    const tokenized = parse(token, locale).raw(false);
    const expected = [
      {
        token: 'all week',
        type: TokenTypes.DURATION
      },
      {
        token: 1,
        type: TokenTypes.DIRECTION_WEEK
      }
    ];

    expect(tokenized).toMatchObject(expected);
  })
);

test('Parser should understand quite complex expressions', () => {
  const parsed = parse(
    'Tue through Friday next week and then again Wed and Thu the week after next',
    locale
  ).raw(false);
  const expected = [
    {
      token: 2,
      type: TokenTypes.DAY_OF_WEEK
    },
    {
      token: 'through',
      type: TokenTypes.RANGE
    },
    {
      token: 5,
      type: TokenTypes.DAY_OF_WEEK
    },
    {
      token: 1,
      type: TokenTypes.DIRECTION_WEEK
    },
    {
      token: 'and',
      type: TokenTypes.ENUMERATION
    },
    {
      token: 3,
      type: TokenTypes.DAY_OF_WEEK
    },
    {
      token: 'and',
      type: TokenTypes.ENUMERATION
    },
    {
      token: 4,
      type: TokenTypes.DAY_OF_WEEK
    },
    {
      token: 2,
      type: TokenTypes.DIRECTION_WEEK
    }
  ];

  expect(parsed).toMatchObject(expected);
});
