import { AfterViewInit, Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CustomValidators } from '../../../services/custom-validators.service';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { JoiningDetails } from '../../../models/joining-details.model';

import { JoiningDetailsService } from '../../../services/joining-details.service';

import { EmployeeService } from '../../../services/employee.service';

import { Employees } from '../../../models/employee.model';

@Component({
  selector: 'app-joining-details',

  templateUrl: './joining-details.component.html',

  styleUrls: ['./joining-details.component.scss'],
})
export class JoiningDetailsComponent implements OnInit {
  joiningForm: FormGroup;

  actionLabel: string;

  queryParams: any;

  joinDate: String;

  selectedDate: Date;

  response: number;

  constructor(
    private formBuilder: FormBuilder,

    private router: Router,

    private route: ActivatedRoute,

    private joiningDetailsService: JoiningDetailsService,

    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });

    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = params;

      this.getNgModuleById(this.queryParams['id']);
    });

    this.getNgModuleById(this.queryParams['id']);

    this.employeeService.searchEmployeeById(this.queryParams.id).subscribe(
      (employee: Employees) => {
        this.joinDate = employee.dateOfJoining;
      },

      (error: any) => {
        console.error('Error fetching employee data:', error);
      }
    );

    const currentDate = new Date();

    this.joiningForm = this.formBuilder.group({
      orgCode: ['AVI01'],

      createdBy: ['Admin'],

      updatedBy: ['Admin'],

      id: [''],

      confirmationDate: [
        '',
        [Validators.required, this.sixMonthsAfterJoining()],
      ],

      noticePeriod: [
        '',
        [
          Validators.required,

          CustomValidators.noLeadingSpace(),

          CustomValidators.whitespaceValidator(),

          CustomValidators.noTrailingSpace(),

          CustomValidators.noticePeriodMaxLength(2),

          CustomValidators.validNoticePeriod(),
        ],
      ],

      resignationDate: [
        '',
        [
          Validators.required,

          CustomValidators.validResignationDate(currentDate),

          CustomValidators.futureDate(),
        ],
      ],

      relievingDate: [
        '',
        [
          Validators.required,

          CustomValidators.validRelievingDate(currentDate),

          CustomValidators.futureDate(),
        ],
      ],
    });
  }

  sixMonthsAfterJoining(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value as Date;

      if (this.checkMonthValidation(value)) {
        console.log('six month');

        return { sixMonthsAfterJoining: true };
      }

      return null;
    };
  }

  getNgModuleById(id: number) {
    this.joiningDetailsService.getByEmployeeId(id).subscribe(
      (response: JoiningDetails) => {
        console.log(response);

        this.joiningForm.patchValue(response, { emitEvent: false });

        this.response = response.id;

        this.actionLabel = 'Update';
      },

      (error) => {
        this.actionLabel = 'Save';
      }
    );
  }

  checkMonthValidation(seletedDate: Date): boolean {
    if (this.joinDate != undefined) {
      console.log(seletedDate);

      const sixMonthsLater = new Date(this.joinDate.toString());

      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      console.log(sixMonthsLater);

      if (seletedDate < sixMonthsLater) {
        return true;
      }
    }

    return false;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.joiningForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.joiningForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      return CustomValidators.getErrorMessage(errorKey, controlName);
    }

    return '';
  }

  onSubmit() {
    if (this.joiningForm.valid) {
      const formData: JoiningDetails = this.joiningForm.value;

      if (this.actionLabel === 'Save') {
        this.joiningDetailsService
          .createJoiningDetails(this.queryParams.id, formData)
          .subscribe(
            (response: JoiningDetails) => {
              this.joiningDetailsService.notify('Data Saved Successfully...');

              this.actionLabel = 'Update';

              this.response = response.id;

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.joiningDetailsService.warn('Credentials already present');
              }
            }
          );
      }

      if (this.actionLabel === 'Update') {
        formData.id = this.response;

        this.joiningDetailsService
          .updateJoiningDetails(this.queryParams.id, formData)
          .subscribe(
            (response: JoiningDetails) => {
              this.joiningDetailsService.notify('Data Saved Successfully...');

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.joiningDetailsService.warn('Credentials already present');
              }
            }
          );
      }
    } else {
      this.joiningForm.markAllAsTouched();
    }
  }
}
