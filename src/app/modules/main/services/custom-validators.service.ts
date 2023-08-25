import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static noLeadingSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && value.startsWith(' ')) {
        return { leadingSpace: true };
      }
      return null;
    };
  }

  static noTrailingSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && value.endsWith(' ')) {
        return { trailingSpace: true };
      }
      return null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && value.length > maxLength) {
        return { maxLength: `Maximum ${maxLength} characters are allowed.` };
      }
      return null;
    };
  }

  static whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && value.trim() === '') {
        return { whitespace: true };
      }
      return null;
    };
  }
  

  static getErrorMessage(errorKey: string): string {
    console.log("errorKey"+errorKey);
   
    const errorMessages: { [key: string]: string } = {
      required: 'This field is required.',
      pattern: 'Invalid pattern',//'No inbetween space allowed',
      leadingSpace: 'Leading space not allowed.',
      trailingSpace: 'Trailing space not allowed.',
      maxLength: 'Maximum characters allowed exceeded.',
      whitespace: 'Space not allowed',
      // Add more error messages as needed...
    };

    return errorMessages[errorKey] || 'Validation error';
  }
}
