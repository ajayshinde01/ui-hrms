import { FormControl, ValidationErrors } from '@angular/forms';

export function whitespaceValidator(
  control: FormControl
): ValidationErrors | null {
  const value = control.value as string;
  console.log(value);
  return value.includes(' ') ? { whitespace: true } : null;
}
