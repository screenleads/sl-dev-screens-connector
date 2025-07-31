
import { Media } from 'src/app/shared/models/media';
import { VisibilityRule } from 'src/app/shared/models/VisibilityRule';
import { Promotion } from './Promotion';


export class Advice {
  private _id: number = 0;
  private _description: string = '';
  private _customInterval: boolean = false;
  private _interval: number = 0;
  private _media?: Media;
  private _promotion?: Promotion | null;
  private _visibilityRules: VisibilityRule[] = [];

  constructor(data?: Partial<Advice>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get description(): string { return this._description; }
  set description(v: string) { this._description = v.trim(); }

  get customInterval(): boolean { return this._customInterval; }
  set customInterval(v: boolean) { this._customInterval = v; }

  get interval(): number { return this._interval; }
  set interval(v: number) { this._interval = v; }

  get media(): Media | undefined { return this._media; }
  set media(v: Media | undefined) { this._media = v; }

  get promotion(): Promotion | null | undefined { return this._promotion; }
  set promotion(v: Promotion | null | undefined) { this._promotion = v; }

  get visibilityRules(): VisibilityRule[] { return this._visibilityRules; }
  set visibilityRules(v: VisibilityRule[]) { this._visibilityRules = v; }
}
