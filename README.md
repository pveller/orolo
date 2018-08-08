# Orolo

Yet another natural language dates parser for JavaScript with a focus on understanding dates and date ranges in a sentence. Orolo is an aggressive parser designed to work on sentenses that are known to contain dates.

## Why

There are very good NLP date parses for JavaScript:

* [chrono](https://github.com/wanasit/chrono)
* [date](https://github.com/MatthewMueller/date)
* [recognizers-date-time](https://github.com/Microsoft/Recognizers-Text/tree/master/JavaScript/packages/recognizers-date-time)

There are also strong general purpose NLP frameworks and some come with pre-build named entity recognition for dates:

* [compromise](https://github.com/spencermountain/compromise)
* [natural](https://github.com/NaturalNode/natural)

Unfortunately, I couldn't find one that would properly understand these sentences:

* Will be in New York on May 5th, 6th, and 7th
* Will be in London from june third till june sixth
* I was in SFO this past Tue and Wed

and that's how _orolo_ was born. Take a look at the [benchmark](https://github.com/pveller/orolo-benchmark) if you wonder how it compares to a few other libraries.

## Install

```
npm install --save orolo
```

_Orolo_ is written in Typescript and is compiled down to ES5 for distribution. I realized though that it's currently using `Array.includes()`, `Array.find()`, `Object.assign()` and thus requires ES6/7 runtime (node 6+) or a polyfill.

## Usage

```javascript
const { Orolo } = require('orolo');

const orolo = new Orolo();
const dates = orolo.recognize(
  'I will be in New York next week Tuesday and also Friday'
);
```

If you know that the dates in the sentence are not relative to today:

```javascript
const context = new Date('2018-05-01');
const dates = orolo.recognize(
  'I am not available next week Mon - Wed',
  context
);
```

## How It Works

Orolo works in two stages. First, it parses the sentence looking for date tokens. The process of _looking_ traverses the list of word tokens with a simple back-off algorithm and defers to locale specific token detectors to recognize date tokens:

![parsing process animated](/animation/parsing.gif)

Then it computes the date tokens by arranging them into a computable sequence. The `DAY_OF_MONTH` token, for example, can't be computed without being attached to either a `MONTH` token or a `DIRECTION_MONTH` token. The `RANGE` token will make _orolo_ return all dates that are between the two boundaries - left and right hand side. In the example above, the left hand side of the range is _complete_ and can be computed. The right hand side of the range, however, is missing a month or a relative month direction (i.e. next month, last month) and so _orolo_ will "borrow" the `DIRECTION_MONTH` from the left hand side. The same logic applies, for example, when computing `I was in New York on May 6th, 7th, and 8th` to compute `7th` and `8th` as `May 7th` and `May 8th` respectively.

## Locales

Right now orolo only supports English but it is designed to support other languages as well. You would need to implement the [`ILocale`](/src/locale/locale.ts) interface. The best way to do it at the moment is to take a look at how [`EnglishLocale`](/src/locale/english/index.ts) is implemented. In short, you specify how to tokenize a sentence, you also specify how many language tokens (words) can a date token span, and then you implement token detectors for each token type that _orolo_ supports.

## Aggressive Parsing

_Orolo_ takes everything that looks like a valid date token and then attempts to compute a date. The following two sentenses will compute down to `May 5th`:

```
It happened on May 5
I bought 5 shirts in May
```

There is no logic currently to look at either dependency graph or proximity of tokens to each other.

## Parsed Sequence

If you would like to take advantage of parsing logic but don't want/need _orolo_ to compute the dates:

```javascript
const { parse, EnglishLocale } = require('orolo');
const sequence = parse(
  'I will be in New York next week Tuesday and also Friday',
  new EnglishLocale()
);

// sequence.tokens will return an Array of parsed tokens
```
