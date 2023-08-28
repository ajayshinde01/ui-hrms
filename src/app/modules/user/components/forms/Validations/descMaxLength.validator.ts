import { FormControl, ValidationErrors } from '@angular/forms';

export function descMaxLength(control: FormControl): ValidationErrors | null {
  const value = control.value as string;
  const inputLength = value && value.length > 250;
  const isValid = !inputLength;
  return isValid ? null : { descMaxLength: true };
}
