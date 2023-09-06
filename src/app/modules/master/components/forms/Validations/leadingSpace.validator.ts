import { FormControl, ValidationErrors } from '@angular/forms';

export function leadingSpaceValidator(
  control: FormControl
): ValidationErrors | null {
  const value = control.value as string;
  const containsLeadingSpace =
    value && value.trim().length !== 0 && value.startsWith(' ');
  const isValid = !containsLeadingSpace;
  return isValid ? null : { leadingSpace: true };
}
