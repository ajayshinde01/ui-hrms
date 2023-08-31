import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class CustomValidators {
  static noLeadingSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (typeof value === 'string' && value && value.startsWith(' ')) {
        return { leadingSpace: true };
      }
      return null;
    };
  }

  static noTrailingSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (typeof value === 'string' && value && value.endsWith(' ')) {
        return { trailingSpace: true };
      }
      return null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (typeof value === 'string' && value && value.length > maxLength) {
        return { maxLength: `Maximum ${maxLength} characters are allowed.` };
      }
      return null;
    };
  }

  static whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (typeof value === 'string' && value && value.trim() === '') {
        return { whitespace: true };
      }
      return null;
    };
  }

  static validDateFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (value && !dateRegex.test(value)) {
        return { validDateFormat: true };
      }
      return null;
    };
  }

  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const selectedDate = new Date(value);
      const currentDate = new Date();
      if (value && selectedDate <= currentDate) {
        return { futureDate: true };
      }
      return null;
    };
  }

  static sixMonthsAfterJoining(joiningDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const confirmationDate = new Date(value);
      const sixMonthsAhead = new Date(joiningDate);
      sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
      if (
        value &&
        (confirmationDate < joiningDate || confirmationDate < sixMonthsAhead)
      ) {
        return { sixMonthsAfterJoining: true };
      }
      return null;
    };
  }

  static validNoticePeriod(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (value && !/^\d+$/.test(value)) {
        return { validNoticePeriod: true };
      }
      return null;
    };
  }
  static validResignationDate(joiningDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const resignationDate = new Date(value);
      if (value && resignationDate <= new Date()) {
        return { validResignationDate: true };
      }
      return null;
    };
  }

  static noticePeriodMaxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (value && value.length > maxLength) {
        return {
          noticePeriodMaxLength: `Maximum ${maxLength} characters are allowed.`,
        };
      }

      return null;
    };
  }

  static validRelievingDate(joiningDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const relievingDate = new Date(value);
      if (value && relievingDate <= new Date()) {
        return { validRelievingDate: true };
      }
      return null;
    };
  }

<<<<<<< HEAD
  // static validVisaDate(): ValidatorFn {
  //   return (control: AbstractControl):  ValidationErrors | { [key: string]: any } | null => {
  //     const value = control.value as Date;
  //     console.log("visadate",value);
  //     const today = new Date();//.getTime();
  
  //     if (!(control && value)) {
  //       // if there's no control or no value, that's ok
  //       return null;
  //     }
  
  //     // return null if there's no errors
  //     if(value < today){
  //       console.log("here1213");
  //        return { checkVisaDate: true };
  //     }else{
  //       console.log("here");
  //     }
  //     return null;
  //   };
    
  // }

  static validVisaDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().getTime();
      console.log("validVisaDate",control.value);
=======
  static validVisaDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date().getTime();

>>>>>>> 49dfb5da72370a4d1b02486bb5f2060d1b0c3223
      if (!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }

      // return null if there's no errors
<<<<<<< HEAD
      return control.value.getTime() < today
        ? { invalidDate: 'Visa Date should be a future date' }
        : null;
=======
      if (control.value.getTime() < today) {
        return { validVisaDate: true };
      } else {
        console.log('here');
      }
      return null;
>>>>>>> 49dfb5da72370a4d1b02486bb5f2060d1b0c3223
    };
  }

  static getErrorMessage(errorKey: string, fieldName: string): string {
    console.log("errorKey",errorKey);
    const fieldNames: { [key: string]: string } = {
      confirmationDate: 'Confirmation Date',
      mobile: 'Mobile',
      resignationDate: 'Resignation Date',
      relievingDate: 'Relieving Date',
      noticePeriod: 'Notice Period',
      departmentId: 'Department Id',
      billable: 'Billable',
      probation: 'Probation',
      companyEmail: 'Company Email',
      clientEmail: 'Client Email',
      shift: 'Shift',
      reportingManager: 'Reporting Manager',
      reviewerManager: 'Reviewer Manager',
      id: 'Designation Id',

      //employee infor form
      employeeCode: 'Employee Code',
      profileImage: 'Profile Image',
      firstName: 'First Name',
      middleName: 'Middle Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date Of Birth',
      gender: 'Gender',
      dateOfJoining: 'Date Of Joining',
      age: 'Age',
      status: 'Status',
      division: 'Division',
      userId: 'UserId',
      email: 'Email',

      //employee Visa Form
      countryCode: 'Country Code',
      visaNumber: 'Visa Number',
      validDate: 'Valid Date',

      //employee address form
      addressType: 'Address Type',
      address1: 'Address 1',
      address2: 'Address 2',
      landmark: 'Landmark',
      tenureYear: 'Years',
      tenureMonth: 'Months',
      ownershipStatus: 'ownershipStatus',
      country: 'Country',
      state: 'State',
      city: 'City',
      postcode: 'Post Code',

      //emegency contact form
      emergencyContactName: 'Name',
      emergencyContactNumber: 'Number',
      relation: 'Relation',

      //educational qualification form
      educationalQualification: 'Educational Qualification',
      qualificationLevel: 'Qualification Level',
      instituteName: 'School/University Name',
      passingYear: 'Passing Year',

      //work Experince
      companyName: 'Comany Name',
      designation: 'Designation',
      fromDate: 'From Date',
      toDate: 'To Date',
      address: 'Address',
    };

    const errorMessages: { [key: string]: string } = {
      required: `Please enter ${fieldNames[fieldName]}`,
      pattern: `Please enter valid ${fieldNames[fieldName]}`,
      leadingSpace: `Leading spaces not allowed in ${fieldNames[fieldName]}`,
      trailingSpace: `Trailing spaces not allowed in ${fieldNames[fieldName]}`,
      maxLength: `${fieldNames[fieldName]} should not exceed limit.`,
      whitespace: `No whitespaces allowed in ${fieldNames[fieldName]}`,
      validDateFormat: `${fieldNames[fieldName]} should be in DD/MM/YYYY format`,
      futureDate: `Please enter a future date for ${fieldNames[fieldName]}`,
      sixMonthsAfterJoining: `Confirmation Date should be at least 6 months after Joining Date`,
      validNoticePeriod: `Notice Period allowed only numeric field`,
      validResignationDate: `Resignation Date should be a future date`,
      validRelievingDate: `Relieving Date should be a future date`,
      validEmailFormat: `Please enter valid email format`,
      checkVisaDate: `should be grater than today`,
      noticePeriodMaxLength: `Maximum 2 number are allowed`,
    };
    return errorMessages[errorKey] || 'Validation error';
  }

  static validEmailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (value && !emailRegex.test(value)) {
        return { validEmailFormat: true };
      }
      return null;
    };
  }
}
