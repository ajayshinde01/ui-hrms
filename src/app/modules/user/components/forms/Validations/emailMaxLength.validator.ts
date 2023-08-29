import { FormControl, ValidationErrors } from '@angular/forms';

export function emailMaxLength(control: FormControl): ValidationErrors | null {
  const value = control.value as string;
  const inputLength = value && value.length > 40;
  const isValid = !inputLength;
  return isValid ? null : { emailMaxLength: true };
}
