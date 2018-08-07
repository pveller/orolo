import { ILocale, ITokenDetector } from './locale/locale';

import { Token, TokenTypes } from './token';

export class Sequence {
  public readonly tokens: Array<Token<any>> = [];

  public push(token: Token<any> | Array<Token<any>>) {
    if (Array.isArray(token)) {
      this.tokens.push(...token);
    } else {
      this.tokens.push(token);
    }
  }

  public raw(all = true): Array<{ type: TokenTypes; token: string | number }> {
    return this.tokens
      .map(token => ({ type: token.type, token: token.token }))
      .filter(token => all || token.type !== TokenTypes.UNDEFINED);
  }
}

interface IParseInput {
  input: string[];
  locale: ILocale;
  sequence?: Sequence;
  position?: number;
}

const isMatch = (token: string, detector: ITokenDetector) =>
  detector.match(token);

const doParse = ({
  input = [],
  locale,
  sequence = new Sequence(),
  position = 0
}: IParseInput): Sequence => {
  const detectors = locale.detectors();

  let segment = Math.min(input.length, locale.maxNGram);
  let frame = input[position];
  let detector: ITokenDetector | undefined;

  while (!detector && segment >= 1) {
    frame = input.slice(position, position + segment).join(' ');
    detector = detectors.find(isMatch.bind(null, frame));
    segment -= 1;
  }

  if (detector) {
    sequence.push(detector.extract(frame));
  } else {
    sequence.push(new Token(frame));
  }

  const next = position + segment + 1;
  if (next >= input.length) {
    return sequence;
  }

  return doParse({ input, sequence, locale, position: next });
};

export const parse = (input: string, locale: ILocale): Sequence => {
  if (!input) {
    return new Sequence();
  }

  const normalized = input.toLowerCase().replace(/\s\s+/g, ' ');
  const tokenized = normalized.split(locale.splitBy);

  const parsed = doParse({ input: tokenized, locale });

  return parsed;
};
