import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Moment } from 'moment';

export function datePickerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden = true;
    if (control.value) {
      const moment: Moment = control.value;
      if (moment.year() > 2000 ) {
        forbidden = false;
      }
    }
    return forbidden ? { 'invalidDOBYear': true } : null;
  };
} 