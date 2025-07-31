import { User } from "./user";


export class LoginResponse {
  private _token: string = '';
  private _user!: User;

  constructor(data?: Partial<LoginResponse>) {
    Object.assign(this, data);
  }

  get token(): string { return this._token; }
  set token(v: string) { this._token = v; }

  get user(): User { return this._user; }
  set user(v: User) { this._user = v; }
}
