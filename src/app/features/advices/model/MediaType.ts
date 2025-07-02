export class MediaType {
  private _id: number = 0;
  private _type: string = '';
  private _extension: string = '';
  private _enabled: boolean = false;

  constructor(
    id?: number,
    type?: string,
    extension?: string,
    enabled?: boolean
  ) {
    this._id = id ?? 0;
    this._type = type ?? '';
    this._extension = extension ?? '';
    this._enabled = enabled ?? false;
  }

  // ID
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  // TYPE
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value.trim();
  }

  // EXTENSION
  get extension(): string {
    return this._extension;
  }
  set extension(value: string) {
    this._extension = value.trim();
  }

  // ENABLED
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(value: boolean) {
    this._enabled = value;
  }
}
