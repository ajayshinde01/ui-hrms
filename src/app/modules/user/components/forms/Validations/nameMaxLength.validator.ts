import { FormControl, ValidationErrors } from '@angular/forms';

export function nameMaxLength(control: FormControl): ValidationErrors | null {
  const value = control.value as string;
  const inputLength = value && value.length > 50;
  const isValid = !inputLength;
  return isValid ? null : { nameMaxLength: true };
}
