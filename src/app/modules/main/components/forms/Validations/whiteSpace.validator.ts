import { FormControl, ValidationErrors } from '@angular/forms';

export function whitespaceValidator(
  control: FormControl
): ValidationErrors | null {
  const isWhitespace = control.value && control.value.trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
