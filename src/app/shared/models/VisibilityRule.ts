import { TimeRange } from './TimeRange';

export class VisibilityRule {
  private _id: number = 0;
  private _day: string = 'MONDAY';
  private _timeRanges: TimeRange[] = [];

  constructor(data?: Partial<VisibilityRule>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get day(): string { return this._day; }
  set day(v: string) { this._day = v; }

  get timeRanges(): TimeRange[] { return this._timeRanges; }
  set timeRanges(v: TimeRange[]) { this._timeRanges = v; }
}
