import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'designation-role',
  templateUrl: './designation.form.component.html',
  styleUrls: ['./designation.form.component.scss'],
})
export class DesignationFormComponent {
  designationForm!: FormGroup;
  designation!: Designation;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  idForUpdate: string;
  actionLabel: string = 'Save';
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
    this.initForm();
  }

  goBack() {
    this.router.navigate(['/master/designation']);
  }
  nonWhitespaceRegExp: RegExp = new RegExp('\\S');

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
          Validators.pattern('^[a-zA-Z0-9\\s_\\-!@&()_{}[\\]|;:",.?]+$'),
        ],
      ],
      orgCode: [
        '',
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
      const formData = this.designationForm.value;

      if (this.actionLabel === 'Save') {
        this.designationService.createDesignation(formData).subscribe(
          (response: Array<Designation>) => {
            console.log('POST-ROLE Request successful', response);

            this.CloseDialog();
            this.router.navigate(['/master/designation']);
            this.designationService.notify('Designation Added successfully..!');
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.designationService.warn('Credentials already present');
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
            this.CloseDialog();
            this.designationService.notify(
              'Designation Updated successfully..!'
            );
            this.router.navigate(['/master/designation']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.designationService.warn('Credentials already present');
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

  CloseDialog() {
    console.log('inside close dialogue');
    this._mdr.close(false);
    this.router.navigate(['/master/designation']);
  }

  resetForm() {
    this.initForm();
  }
}
