import { MediaType } from './MediaType'; // Ajusta el path según tu estructura

export class Media {
  private _id: number = 0;
  private _src: string = '';
  private _type: MediaType | undefined;

  constructor(id?: number, src?: string, type?: MediaType) {
    this._id = id ?? 0;
    this._src = src ?? '';
    this._type = type;
  }

  // ID
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  // SRC
  get src(): string {
    return this._src;
  }
  set src(value: string) {
    this._src = value.trim();
  }

  // TYPE
  get type(): MediaType | undefined {
    return this._type;
  }
  set type(value: MediaType | undefined) {
    this._type = value;
  }

}
