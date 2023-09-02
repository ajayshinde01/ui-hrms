import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirstLetterCapitalService {
  constructor() {}

  capitalizeFirstLetter(value: string): string {
    if (value.length === 0) {
      return value;
    }
    const firstLetter = value.charAt(0).toUpperCase();
    const restOfValue = value.slice(1);
    return firstLetter + restOfValue;
  }
}
