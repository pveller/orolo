import { Token } from '../token';

interface ITokenDetector {
  match(token: string): boolean;
  extract(token: string): Token<any> | Array<Token<any>>;
}

interface ILocale {
  splitBy: RegExp;
  maxNGram: number;
  detectors(): ITokenDetector[];
}

export { ILocale, ITokenDetector };
