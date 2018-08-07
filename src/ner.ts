import * as _ from 'lodash';

import { eachDay } from 'date-fns';

import { parse } from './parser';
import { Token, TokenTypes } from './token';

import { EnglishLocale } from './locale/english';
import { ILocale } from './locale/locale';

// we don't try to compensate for missing attachments
const isComplete = (tokens: Array<Token<any>>) =>
  tokens
    .filter(token => token.requiredAnchors().length > 0)
    .every(
      tokenA =>
        !!tokens.find(tokenB => tokenA.requiredAnchors().includes(tokenB.type))
    );

const complete = (
  source: Array<Token<any>>,
  target: Array<Token<any>>,
  reverse: boolean
) => {
  // 1. look for missing anchors
  const missingAnchors = source.filter(
    token => token.requiredAnchors().length > 0
  );

  // 2. for each token, find its anchor and inject into the array right next to it
  // Reverse the search if we are completing the right from the left
  const searchIn = reverse ? [...target].reverse() : target;

  missingAnchors.forEach(incomplete => {
    const position = source.indexOf(incomplete);

    const anchor = searchIn.find(token =>
      incomplete.requiredAnchors().includes(token.type)
    );

    if (!anchor) {
      throw new Error(
        `Cannot complete ${JSON.stringify(incomplete)} from ${JSON.stringify(
          source
        )} using ${JSON.stringify(target)}`
      );
    }

    source.splice(
      position,
      0,
      Object.assign(Object.create(Object.getPrototypeOf(anchor)), {
        ...anchor,
        attachments: []
      })
    );
  });
};

const split = (tokens: Array<Token<any>>, index: number) => {
  const left = tokens.slice(0, index);
  const right = tokens.slice(index + 1);

  // sometimes anchors will be only on one side of the enumeration or range
  if (!isComplete(left)) {
    complete(left, right, false);
  }
  if (!isComplete(right)) {
    complete(right, left, true);
  }

  return [left, right];
};

const compute = (
  tokens: Array<Token<any>>,
  today: Date = new Date()
): Date[] => {
  if (tokens.length === 0) {
    return [];
  }
  // 1. split by emumeration
  const splitByEnumeration = tokens.findIndex(
    token => token.type === TokenTypes.ENUMERATION
  );

  if (splitByEnumeration > -1) {
    const [left, right] = split(tokens, splitByEnumeration);

    return _.flatMap([compute(left, today), compute(right, today)]);
  }

  // 2. split by range
  const splitByRange = tokens.findIndex(
    token => token.type === TokenTypes.RANGE
  );

  if (splitByRange > -1) {
    const [left, right] = split(tokens, splitByRange);

    // left and right equation of a range will always compute down to a date
    return eachDay(compute(left, today)[0], compute(right, today)[0]);
  }

  // attach every token to its anchor
  tokens.forEach((token, idx) => {
    // we can't filter, need to preserve the index in the original sequence
    // so that we could do a search for the nearest anchor candidate
    if (token.willAttachTo().length > 0) {
      let anchor = null;
      // how far back and forward we need to look
      const reach = Math.max(idx, tokens.length - 1 - idx);
      for (let step = 1; !anchor && step <= reach; step += 1) {
        // look behind and ahead and discard undefineds if we get out of boundary
        // give more priority to the token behind

        // ToDo: we probably need to give locales the control over what direction takes precedence?
        anchor = [tokens[idx - step], tokens[idx + step]]
          .filter(Boolean)
          .find(candidate => token.willAttachTo().includes(candidate.type));
      }
      if (anchor) {
        anchor.attach(token);
      }
    }
  });

  // ToDo: do we need to inject a Year Direction token?

  // only compute top level tokes that didn't attach anywhere
  const heads = tokens.filter(token => !token.anchor);
  const dates = _.flatMap(heads, head => head.compute(today));

  return dates;
};

export class NER {
  private locale: ILocale;

  constructor(locale: ILocale = new EnglishLocale()) {
    this.locale = locale;
  }

  public recognize(utterance: string, today = new Date()) {
    if (!utterance) {
      return [];
    }

    const sequence = parse(utterance, this.locale);

    return compute(
      sequence.tokens.filter(token => token.type !== TokenTypes.UNDEFINED),
      today
    );
  }
}
