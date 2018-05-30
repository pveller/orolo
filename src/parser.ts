import { IMatcher, matchers } from './matcher';
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

  public raw(all = true): Array<{ type: TokenTypes; token: Token<any> }> {
    return this.tokens
      .map(token => ({ type: token.type, token: token.token }))
      .filter(token => all || token.type !== TokenTypes.UNDEFINED);
  }
}

interface IParseInput {
  input: string[];
  step: number;
  sequence?: Sequence;
  position?: number;
}

const doParse = ({
  input = [],
  step,
  sequence = new Sequence(),
  position = 0
}: IParseInput): Sequence => {
  let segment = Math.min(input.length, step);
  let frame: string = input[position];
  let factory = null;

  const isMatch = (token: string, matcher: IMatcher) => matcher.match(token);
  while (!factory && segment >= 1) {
    frame = input.slice(position, position + segment).join(' ');
    factory = matchers.find(isMatch.bind(null, frame));
    segment -= 1;
  }

  if (factory) {
    sequence.push(factory.extract(frame));
  } else {
    sequence.push(new Token(frame));
  }

  const next = position + segment + 1;
  if (next >= input.length) {
    return sequence;
  }

  return doParse({ input, sequence, step, position: next });
};

export const parse = (input: string): Sequence => {
  if (!input) {
    return new Sequence();
  }

  const normalized = input.toLowerCase().replace(/\s\s+/g, ' ');

  // ToDo: split expression should come from the localization
  const tokenized = normalized.split(/[^A-Za-zА-Яа-я0-9/_-]+/);

  // ToDo: step should come from the localization
  const parsed = doParse({ input: tokenized, step: 4 });

  return parsed;
};
