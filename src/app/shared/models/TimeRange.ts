export class TimeRange {
  private _id: number = 0;
  private _fromTime: [number, number] = [0, 0];
  private _toTime: [number, number] = [0, 0];

  constructor(data?: Partial<TimeRange>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get fromTime(): [number, number] { return this._fromTime; }
  set fromTime(v: [number, number]) { this._fromTime = v; }

  get toTime(): [number, number] { return this._toTime; }
  set toTime(v: [number, number]) { this._toTime = v; }
}
