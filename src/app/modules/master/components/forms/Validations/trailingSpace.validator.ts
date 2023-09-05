// import { FormControl, ValidationErrors } from '@angular/forms';

// export function trailingSpaceValidator(
//   control: FormControl
// ): ValidationErrors | null {
//   const value = control.value as string;
//   const containsTrailingSpace =
//     value && value.trim().length !== 0 && value.endsWith(' ');
//   const isValid = !containsTrailingSpace;
//   return isValid ? null : { trailingSpace: true };
// }


import { FormControl, ValidationErrors } from '@angular/forms';

export function trailingSpaceValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;

  if (typeof value === 'string' && value.trim() !== value) {
    // Return a validation error object if trailing spaces are found
    return { trailingSpace: true };
  }

  // If the value is not a string or does not have trailing spaces, return null
  return null;
}
