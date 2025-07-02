import { Media } from "./Media";
import { Promotion } from "./Promotion";

export class Advice {
  private _id: number = 0;
  private _description: string = "";
  private _customInterval: boolean = false;
  private _interval: number = 0;
  private _promo: Promotion | undefined;
  private _media: Media | undefined;

  // ID
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  // Description
  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value.trim(); // lógica opcional
  }

  // Custom Interval
  get customInterval(): boolean {
    return this._customInterval;
  }
  set customInterval(value: boolean) {
    this._customInterval = value;
  }

  // Interval
  get interval(): number {
    return this._interval;
  }
  set interval(value: number) {
    if (value >= 0) {
      this._interval = value;
    } else {
      throw new Error("El intervalo no puede ser negativo");
    }
  }

  // Promo
  get promo(): Promotion | undefined {
    return this._promo;
  }
  set promo(value: Promotion | undefined) {
    this._promo = value;
  }

  // Media
  get media(): Media | undefined {
    return this._media;
  }
  set media(value: Media | undefined) {
    this._media = value;
  }


}