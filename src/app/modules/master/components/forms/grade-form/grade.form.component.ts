import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grade } from '../../../models/grade.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { DesignationService } from '../../../services/designation.service';
import { GradeService } from '../../../services/grade.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { HttpParams } from '@angular/common/http';
import { GradeType } from '../../../models/gradeType';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade.form.component.html',
  styleUrls: ['./grade.form.component.scss'],
})
export class GradeFormComponent {
  gradeForm!: FormGroup;
  grade!: Grade;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  button: boolean = false;
  isDisabled: boolean = false;
  gradeTypeOptions: { gradeType: Array<GradeType> } = {
    gradeType: [],
  };
  params: HttpParams = new HttpParams();
  datatype: string = '';
  errorMessage: string = '';

  constructor(
    private _mdr: MatDialogRef<GradeFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    private formBuilder: FormBuilder,
    private designationService: DesignationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.getGradeType();
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
    this.gradeForm = this.formBuilder.group({
      id: [''],
      gradeId: [
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
      gradeName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
        ],
      ],
      gradeType: ['', Validators.required],
      orgCode: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
          whitespaceValidator,
        ],
      ],
      createdBy: ['Admin'],
      updatedBy: ['Super Admin'],
    });
  }

  get gradeIdControl() {
    return this.gradeForm.get('gradeId');
  }
  get gradeNameControl() {
    return this.gradeForm.get('gradeName');
  }
  get gradeTypeControl() {
    return this.gradeForm.get('gradeType');
  }
  get orgControl() {
    return this.gradeForm.get('orgCode');
  }

  onSumbit() {
    this.isDisabled = false;
    if (this.gradeForm.valid) {
      this.gradeForm.get('gradeId')?.enable();
      const formData = this.gradeForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.gradeService.createGrade(formData).subscribe(
          (response: Array<Grade>) => {
            console.log('POST-GRADE Request successful', response);
            this.gradeService.notify('Grade added successfully');
            this.CloseDialog();
          },
          (error: any) => {
            if (error.status == 400) {
              this.errorMessage = error.error.message;
              this.gradeService.warn(this.errorMessage);
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        console.log(formData.gradeId);
        this.gradeService.updateGrade(formData).subscribe(
          (response: Array<Grade>) => {
            console.log('PUT-GRADE Request successful', response);
            this.gradeService.notify('Grade updated successfully');
            this.CloseDialog();
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.gradeService.warn('Credentials already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    console.log('get by id');
    this.gradeService.searchByGradeId(id).subscribe((response: Grade) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.gradeForm.patchValue(response);
      console.log(this.gradeForm.value);
      this.grade = response;
    });
  }

  getGradeType() {
    this.gradeService
      .gradeTypeFromCommonMaster()
      .subscribe((response: { gradeType: Array<GradeType> }) => {
        console.log(
          'GET-GRADE TYPE FROM COMMON MASTER successful',
          (this.datatype = typeof response)
        );
        this.gradeTypeOptions = response;
        console.log(this.gradeTypeOptions);
      });
  }

  CloseDialog() {
    this._mdr.close(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
