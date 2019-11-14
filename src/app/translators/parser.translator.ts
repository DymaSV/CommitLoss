import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParserTranslator {
  public parseValue(
    value: string
  ): { alias: string; num: number; sign: string }[] {
    const resArray: { alias: string; num: number; sign: string }[] = [];
    const splitted = value.split(';');
    splitted.forEach(element => {
      const regExpStr = /[A-Za-z0-9]{0,4}/g;
      const al = element.match(regExpStr)[0];
      const regExpSign = /(\+|\-)/;
      const si = element.match(regExpSign)[0];
      const regExpNum = /(\+|\-)(\d+)(\.\d+)?/g;
      const nu = +element.match(regExpNum)[0].substr(1, element.match(regExpNum)[0].length);
      resArray.push({ alias: al, num: nu, sign: si });
    });
    return resArray;
  }
}
