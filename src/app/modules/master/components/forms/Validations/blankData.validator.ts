import { FormControl, ValidationErrors } from '@angular/forms';

export function blankValidator(control: FormControl): ValidationErrors | null {
  const value = control.value as string;
  console.log(value);
  if (value && value.trim() === '') {
    // Return a validation error object
    return { blank: true };
  }

  // If the value is not blank, return null to indicate no validation error
  return null;

  //return value.includes(' ') ? { blankData: true } : null;
}
