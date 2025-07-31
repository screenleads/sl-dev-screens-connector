import { MediaType } from './MediaType';

export class Media {
  private _id: number = 0;
  private _src: string = '';
  private _type?: MediaType;

  constructor(data?: Partial<Media>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get src(): string { return this._src; }
  set src(v: string) { this._src = v.trim(); }

  get type(): MediaType | undefined { return this._type; }
  set type(v: MediaType | undefined) { this._type = v; }
}
