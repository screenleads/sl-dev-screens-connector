import { Promotion } from "./Promotion";

export class Advice {
  private id: number = 0;
  private reference: string = "";
  private timeInterval: number = 3000;
  private promo: Promotion | undefined;

  constructor(
     id: number = 0,
     reference: string = "",
     timeInterval: number = 3000,
     promo: Promotion | undefined = undefined
  ) {
    this.setId(id);
    this.setReference(reference);
    this.setTimeInterval(timeInterval);
    this.setPromo(promo);
    
  }

  public getId(): number {
    return this.id;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public getReference(): string {
    return this.reference;
  }
  public setReference(reference: string): void {
    this.reference = reference;
  }
  public getTimeInterval(): number {
    return this.timeInterval;
  }
  public setTimeInterval(timeInterval: number): void {
    this.timeInterval = timeInterval;
  }
  public getPromo(): Promotion | undefined {
    return this.promo;
  }
  public setPromo(promo: Promotion | undefined): void {
    this.promo = promo;
  }

}