import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DesignationService } from '../../../services/designation.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Designation } from '../../../models/designation.model';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { descMaxLength } from '../Validations/descMaxLength.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { DesignationComponent } from '../../summary-tables/designation/designation.component';
import { HttpParams } from '@angular/common/http';
import { blankValidator } from '../Validations/blankData.validator';

@Component({
  selector: 'designation-role',
  templateUrl: './designation.form.component.html',
  styleUrls: ['./designation.form.component.scss'],
})
export class DesignationFormComponent {
  @ViewChild(DesignationComponent)
  sendToDesignationTable!: DesignationComponent;
  designationForm!: FormGroup;
  designation!: Designation;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  idForUpdate: string;
  actionLabel: string = 'Save';
  params: HttpParams = new HttpParams();
  errorMessage: string = '';
  orgCode = sessionStorage.getItem('orgCode');

  constructor(
    private _mdr: MatDialogRef<DesignationFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private formBuilder: FormBuilder,
    private designationService: DesignationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.idForUpdate = data;
    console.log(this.idForUpdate);
  }

  ngOnInit(): void {
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);

    this.collectQueryParams();
    this.initForm();
    this.designationForm
      .get('designationId')
      ?.valueChanges.subscribe((value: string) => {
        this.designationForm
          .get('designationId')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.designationForm
      .get('orgCode')
      ?.valueChanges.subscribe((value: string) => {
        this.designationForm
          .get('orgCode')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.designationForm
      .get('designationName')
      ?.valueChanges.subscribe((value: string) => {
        if (value.length > 0) {
          const firstLetter = value.charAt(0).toUpperCase();

          const restOfValue = value.slice(1);

          const newValue = firstLetter + restOfValue;

          this.designationForm
            .get('designationName')
            ?.setValue(newValue, { emitEvent: false });
        }
      });
  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        console.log(this.queryParams['id']);
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
      }
    });
  }

  initForm() {
    this.designationForm = this.formBuilder.group({
      id: [''],
      designationId: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,

          idMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-]+$'),
          whitespaceValidator,
        ],
      ],
      designationName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],
      designationDesc: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          descMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z0-9\\s_\\-!@&()_{}[\\]|;:",.?]+$'),
        ],
      ],
      orgCode: [
        { value: this.orgCode, disabled: true },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
          whitespaceValidator,
        ],
      ],
      createdBy: ['Admin'],
      createdAt: [''],
      updatedBy: [''],
      updatedAt: [''],
      isDeleted: [false],
    });
  }

  get designationIdControl() {
    return this.designationForm.get('designationId');
  }
  get designationNameControl() {
    return this.designationForm.get('designationName');
  }
  get designationDescControl() {
    return this.designationForm.get('designationDesc');
  }
  get orgControl() {
    return this.designationForm.get('orgCode');
  }

  onSumbit() {
    if (this.designationForm.valid) {
      this.designationForm.get('designationId')?.enable();
      this.designationForm.get('orgCode')?.enable();
      const formData = this.designationForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.designationService.createDesignation(formData).subscribe(
          (response: Array<Designation>) => {
            console.log('POST-ROLE Request successful', response);
            this.designationService.notify('Designation added successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400) {
              this.errorMessage = error.error.message;
              this.designationService.warn(this.errorMessage);
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.designationService.updateDesignation(formData).subscribe(
          (response: Array<Designation>) => {
            console.log('PUT-ROLE Request successful', response);
            this.designationService.notify('Designation updated successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.designationService.warn(error.error.message);
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    console.log('search by id');
    this.designationService
      .searchDesignationById(id)
      .subscribe((response: Designation) => {
        console.log('GET-SEARCH BY ID Request successful', response);
        this.designationForm.patchValue(response);
        console.log(this.designationForm.value);
        this.designation = response;
      });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
