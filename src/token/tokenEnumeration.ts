import Token from './token';
import TokenTypes from './types';

export default class TokenEnumeration extends Token<string> {
  constructor(token: string) {
    super(token, TokenTypes.ENUMERATION);
  }
}
