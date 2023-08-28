import { FormControl, ValidationErrors } from '@angular/forms';

export function priorityMaxLength(
  control: FormControl
): ValidationErrors | null {
  const value = control.value as number;
  const inputLength = value && value > 100;
  const isValid = !inputLength;
  return isValid ? null : { priorityMaxLength: true };
}
