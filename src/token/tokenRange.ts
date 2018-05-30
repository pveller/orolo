import Token from './token';
import TokenTypes from './types';

export default class TokenRange extends Token<string> {
  constructor(token: string) {
    super(token, TokenTypes.RANGE);
  }
}
