import { Media } from "./media";


export class Company {
  private _id: number = 0;
  private _name: string = '';
  private _observations: string = '';
  private _logo: Media | null = null;

  constructor(data?: Partial<Company>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get name(): string { return this._name; }
  set name(v: string) { this._name = v.trim(); }

  get observations(): string { return this._observations; }
  set observations(v: string) { this._observations = v.trim(); }

  get logo(): Media | null { return this._logo; }
  set logo(v: Media | null) { this._logo = v; }
}
