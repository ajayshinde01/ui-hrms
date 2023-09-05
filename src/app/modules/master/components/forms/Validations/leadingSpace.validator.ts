

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function leadingSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Check if the value is a string and contains leading spaces
    if (typeof value === 'string' && value.trimLeft() !== value) {
      return { leadingSpace: true };
    }

    return null; // No validation error
  };
}

