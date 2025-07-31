export class Authority {
  private _authority: string = '';

  constructor(data?: Partial<Authority>) {
    Object.assign(this, data);
  }

  get authority(): string { return this._authority; }
  set authority(v: string) { this._authority = v.trim(); }
}
