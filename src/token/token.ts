import TokenTypes from './types';

export default class Token<T> {
  public readonly type: TokenTypes;
  public readonly token: T;
  public readonly attachments: Array<Token<any>> = [];
  public anchor?: Token<any>;

  constructor(token: T, type: TokenTypes = TokenTypes.UNDEFINED) {
    this.type = type;
    this.token = token;
  }

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

  // ToDo: unit test how completeless changes
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

  // ToDo: do we need a detach counterpart? we can modify attachments and it will not modify the respective anchor
  public attach(token: Token<any>): void {
    if (token && this.willAnchor().includes(token.type)) {
      // ToDo: do we ever have multiple tokens?
      token.anchor = this;
      this.attachments.push(token);
    }
  }

  public compute(today = new Date()): Date | Date[] {
    return [];
  }
}

// ToDo: wednesday, thursday and then again next week Tuesday
