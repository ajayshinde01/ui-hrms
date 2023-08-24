import { FormControl, ValidationErrors } from '@angular/forms';

export function trailingSpaceValidator(
  control: FormControl
): ValidationErrors | null {
  const value = control.value as string;
  const containsTrailingSpace =
    value && value.trim().length !== 0 && value.endsWith(' ');
  const isValid = !containsTrailingSpace;
  return isValid ? null : { trailingSpace: true };
}
