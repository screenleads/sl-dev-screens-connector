export class Promotion {
  private id: number = 0;
  private urlLegal: string = "";
  constructor(
     id: number = 0,
     urlLegal: string = "",
     urlPromo: string = ""
  ) {
    this.setId(id);
    this.setUrlLegal(urlLegal);
    this.setUrlPromo(urlPromo);
  }

  public getId(): number {
    return this.id;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public getUrlLegal(): string {
    return this.urlLegal;
  }
  public setUrlLegal(reference: string): void {
    this.urlLegal = reference;
  }
  public getUrlPromo(): string {
    return this.urlLegal;
  }
  public setUrlPromo(reference: string): void {
    this.urlLegal = reference;
  }
  

}