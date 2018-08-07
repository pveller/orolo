import TokenTypes from './types';

// ToDo: I think it makes sense to also hold on to the original string token
export default class Token<T> {
  public readonly type: TokenTypes;
  public readonly token: T;
  public readonly attachments: Array<Token<any>> = [];
  public anchor?: Token<any>;

  constructor(token: T, type: TokenTypes = TokenTypes.UNDEFINED) {
    this.type = type;
    this.token = token;
  }

  // ToDo: simplify these APIs

  public requiredAttachments(): TokenTypes[] {
    return [];
  }

  public requiredAnchors(): TokenTypes[] {
    return [];
  }

  public willAttachTo(): TokenTypes[] {
    return this.requiredAnchors();
  }

  public willAnchor(): TokenTypes[] {
    return this.requiredAttachments();
  }

  public isComplete(): boolean {
    const anchors =
      this.requiredAnchors().length === 0 ||
      (!!this.anchor && this.requiredAnchors().includes(this.anchor.type));

    const attachments =
      this.requiredAttachments().length === 0 ||
      this.requiredAttachments().every(
        type => !!this.attachments.find(token => token.type === type)
      );

    return anchors && attachments;
  }

  public attach(token: Token<any>): void {
    if (token && this.willAnchor().includes(token.type)) {
      token.anchor = this;
      this.attachments.push(token);
    }
  }

  public compute(today = new Date()): Date | Date[] {
    return [];
  }
}
