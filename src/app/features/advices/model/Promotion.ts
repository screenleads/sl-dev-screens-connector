export class Promotion {
  private _id: number = 0;
  private _legalUrl: string = '';
  private _url: string = '';
  private _description: string = '';
  private _templateHtml: string = '';

  constructor(data?: Partial<Promotion>) {
    Object.assign(this, data);
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get legalUrl(): string {
    return this._legalUrl;
  }

  set legalUrl(value: string) {
    this._legalUrl = value.trim();
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value.trim();
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value.trim();
  }

  get templateHtml(): string {
    return this._templateHtml;
  }

  set templateHtml(value: string) {
    this._templateHtml = value;
  }
}
