export class ChatMessage {
  private _id: number = 0;
  private _content: string = '';
  private _senderId: number = 0;
  private _timestamp: string = '';

  constructor(data?: Partial<ChatMessage>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get content(): string { return this._content; }
  set content(v: string) { this._content = v.trim(); }

  get senderId(): number { return this._senderId; }
  set senderId(v: number) { this._senderId = v; }

  get timestamp(): string { return this._timestamp; }
  set timestamp(v: string) { this._timestamp = v; }
}
