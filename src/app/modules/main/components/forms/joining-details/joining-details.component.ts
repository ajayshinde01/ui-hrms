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
import * as moment from 'moment';

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
  orgCode = sessionStorage.getItem('orgCode');

  response: number;

  constructor(
    private formBuilder: FormBuilder,

    private router: Router,

    private route: ActivatedRoute,

    private joiningDetailsService: JoiningDetailsService,

    private employeeService: EmployeeService
  ) { }

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
      orgCode: this.orgCode,

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
          CustomValidators.validNoticePeriod(),
          CustomValidators.noticePeriodMaxLength(2),
          Validators.required

        ],
      ],

      resignationDate: [
        '',
        [
          CustomValidators.validResignationDate(currentDate),
          CustomValidators.futureDate(),
        ],
      ],

      relievingDate: [
        '',
        [
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
      const sixMonthsLater = new Date(this.joinDate.toString());
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
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

      const value = Object.values(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName, value);
    }

    return '';
  }

  onSubmit() {
    if (this.joiningForm.valid) {
      const formData = {
        ...this.joiningForm.value,
        confirmationDate: moment(this.joiningForm.value.confirmationDate)
          .utcOffset(0, true)
          .format('YYYY-MM-DD'),
        resignationDate: this.joiningForm.value.resignationDate
          ? moment(this.joiningForm.value.resignationDate)
            .utcOffset(0, true)
            .format('YYYY-MM-DD')
          : null, // Replace with your desired invalid date format
        relievingDate: this.joiningForm.value.relievingDate
          ? moment(this.joiningForm.value.relievingDate)
            .utcOffset(0, true)
            .format('YYYY-MM-DD')
          : null, // Replace with your desired invalid date format
      };

      if (this.actionLabel === 'Save') {
        this.joiningDetailsService
          .createJoiningDetails(this.queryParams.id, formData)
          .subscribe(
            (response: JoiningDetails) => {
              this.joiningDetailsService.notify(
                'Joining Details added successfully'
              );

              this.actionLabel = 'Update';

              this.response = response.id;

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.joiningDetailsService.warn(
                  'Joining Details already present'
                );
              }
            }
          );
      }

      if (this.actionLabel === 'Update') {
        formData.id = this.response;
        formData.updatedBy = 'Admin';

        this.joiningDetailsService
          .updateJoiningDetails(this.queryParams.id, formData)
          .subscribe(
            (response: JoiningDetails) => {
              this.joiningDetailsService.notify(
                'Joining Details updated successfully'
              );

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.joiningDetailsService.warn(
                  'Joining Details already present'
                );
              }
            }
          );
      }
    } else {
      this.joiningForm.markAllAsTouched();
    }
  }
}
