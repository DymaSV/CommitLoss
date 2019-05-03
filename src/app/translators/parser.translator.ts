import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParserTranslator {
  public parseValue(
    value: string
  ): { alias: string; num: number; sign: string } {
    return null;
  }
}
