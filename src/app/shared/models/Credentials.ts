export class Credentials {
  private _username: string = '';
  private _password: string = '';

  constructor(data?: Partial<Credentials>) {
    Object.assign(this, data);
  }

  get username(): string { return this._username; }
  set username(v: string) { this._username = v.trim(); }

  get password(): string { return this._password; }
  set password(v: string) { this._password = v; }
  toJSON(): Record<string, any> {
    return {
      username: this._username,
      password: this._password
    };
  }
}
