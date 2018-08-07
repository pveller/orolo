# Orolo

Yet another natural language dates parser for JavaScript with a focus on understanding dates and date ranges in a sentence. Orolo is an aggressive parser designed to work on sentenses that are known to contain dates.

## Why

There are very good NLP date parses for JavaScript:

* [chrono](https://github.com/wanasit/chrono)
* [date](https://github.com/MatthewMueller/date)
* [recognizers-text-date-time]()

There are also strong general purpose NLP frameworks and some come with pre-build named entity recognition for dates:

* [compromise](https://github.com/spencermountain/compromise)
* [natural](https://github.com/NaturalNode/natural)

Unfortunately, I couldn't find one that would properly understand these sentences:

* Will be in New York on May 5th, 6th, and 7th
* Will be in London from june third till june sixth
* I was in SFO this past Tue and Wed

and that's how _orolo_ was born.

## Install

```
npm install --save orolo
```

## Usage

```javascript
const { Orolo } = require('orolo');

const orolo = new Orolo();
const dates = orolo.recognize(
  'I will be in New York next week Tuesday and Friday'
);
```

If you know that the dates in the sentence are not relative to today:

```javascript
const context = new Date('2018-05-01');
const dates = orolo.recognize('I am not available next week Mon - Wed');
```

## How It Works

Orolo works in two stages. First, it parses the sentence looking for date tokens. Then it computes the tokens by arranging them into a computable sequence.

## Locales

Right now orolo only supports English but it is designed to support other languages as well:

```typescript
interface ILocale {
  splitBy: RegExp;
  maxNGram: number;
  detectors(): ITokenDetector[];
}
```

TBD [explain in more details]
