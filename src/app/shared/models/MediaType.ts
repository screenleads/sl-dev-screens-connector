export class MediaType {
  private _id: number = 0;
  private _type: string = '';
  private _extension: string = '';
  private _enabled: boolean = true;

  constructor(data?: Partial<MediaType>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get type(): string { return this._type; }
  set type(v: string) { this._type = v.trim(); }

  get extension(): string { return this._extension; }
  set extension(v: string) { this._extension = v.trim(); }

  get enabled(): boolean { return this._enabled; }
  set enabled(v: boolean) { this._enabled = v; }
}
