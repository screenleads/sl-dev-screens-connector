export class Role {
  private _id: number = 0;
  private _role: string = '';
  private _description: string = '';
  private _level: number = 0;

  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  {
    console.log('[Role] Instanciado:', { id: this.id, role: this.role, level: this.level, description: this.description, permissions: this.permissions });

  get id(): number { return this._id; }
  set id(v: number) { this._id = v; }

  get role(): string { return this._role; }
  set role(v: string) { this._role = v.trim(); }

  get description(): string { return this._description; }
  set description(v: string) { this._description = v.trim(); }

  get level(): number { return this._level; }
  set level(v: number) { this._level = v; }
}
