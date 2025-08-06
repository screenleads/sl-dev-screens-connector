type CommandMessage = 'REFRESH_ADS' | 'RESTART_APP' | 'MAINTENANCE_MODE' | 'NOTIFY';
export class ChatMessage {
  private _type: CommandMessage = 'REFRESH_ADS';
  private _message: string = '';
  private _senderId: string = '';
  private _senderName: string = '';
  private _roomId: string = '';
  private _timestamp: string = '';
  private _metadata: Record<string, any> = {};
  private _systemGenerated: boolean = false;

  constructor(data?: Partial<ChatMessage>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  get type(): CommandMessage { return this._type; }
  set type(v: CommandMessage) { this._type = v; }

  get message(): string { return this._message; }
  set message(v: string) { this._message = v.trim(); }

  get senderId(): string { return this._senderId; }
  set senderId(v: string) { this._senderId = v; }

  get senderName(): string { return this._senderName; }
  set senderName(v: string) { this._senderName = v.trim(); }

  get roomId(): string { return this._roomId; }
  set roomId(v: string) { this._roomId = v; }

  get timestamp(): string { return this._timestamp; }
  set timestamp(v: string) { this._timestamp = v; }

  get metadata(): Record<string, any> { return this._metadata; }
  set metadata(v: Record<string, any>) { this._metadata = v || {}; }

  get systemGenerated(): boolean { return this._systemGenerated; }
  set systemGenerated(v: boolean) { this._systemGenerated = v; }
}
