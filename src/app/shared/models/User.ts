import { Authority } from "./Authority";
import { Company } from "./Company";
import { Media } from "./media";
import { Role } from "./Role";



export class User {
  private _id: number = 0;
  private _username: string = '';
  private _email: string = '';
  private _name: string = '';
  private _lastName: string = '';
  private _company?: Company;
  private _profileImage: Media | null = null;
  private _roles: Role[] = [];
  private _enabled: boolean = true;
  private _accountNonExpired: boolean = true;
  private _accountNonLocked: boolean = true;
  private _credentialsNonExpired: boolean = true;
  private _authorities: Authority[] = [];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get username(): string { return this._username; }
  set username(v: string) { this._username = v.trim(); }

  get email(): string { return this._email; }
  set email(v: string) { this._email = v.trim(); }

  get name(): string { return this._name; }
  set name(v: string) { this._name = v.trim(); }

  get lastName(): string { return this._lastName; }
  set lastName(v: string) { this._lastName = v.trim(); }

  get company(): Company | undefined { return this._company; }
  set company(v: Company | undefined) { this._company = v; }

  get profileImage(): Media | null { return this._profileImage; }
  set profileImage(v: Media | null) { this._profileImage = v; }

  get roles(): Role[] { return this._roles; }
  set roles(v: Role[]) { this._roles = v; }

  get enabled(): boolean { return this._enabled; }
  set enabled(v: boolean) { this._enabled = v; }

  get accountNonExpired(): boolean { return this._accountNonExpired; }
  set accountNonExpired(v: boolean) { this._accountNonExpired = v; }

  get accountNonLocked(): boolean { return this._accountNonLocked; }
  set accountNonLocked(v: boolean) { this._accountNonLocked = v; }

  get credentialsNonExpired(): boolean { return this._credentialsNonExpired; }
  set credentialsNonExpired(v: boolean) { this._credentialsNonExpired = v; }

  get authorities(): Authority[] { return this._authorities; }
  set authorities(v: Authority[]) { this._authorities = v; }
}
