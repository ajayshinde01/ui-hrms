import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grade } from '../../../models/grade.model';
import { MatDialog } from '@angular/material/dialog';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { DesignationService } from '../../../services/designation.service';
import { GradeService } from '../../../services/grade.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';

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
  constructor(
    private formBuilder: FormBuilder,
    private designationService: DesignationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;

      if (this.queryParams['id'] != undefined) {
        console.log(this.queryParams['id']);
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
      } else {
        this.actionLabel = 'Save';
      }
    });
  }

  initForm() {
    this.gradeForm = this.formBuilder.group({
      id: [''],
      gradeId: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[a-zA-Z0-9]{1,50}$'),
        ],
      ],
      gradeName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          Validators.pattern('^[a-zA-Z-_ ]{1,100}$'),
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
          Validators.pattern('^[a-zA-Z-_]{1,10}$'),
        ],
      ],
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
    if (this.gradeForm.valid) {
      const formData = this.gradeForm.value;

      if (this.actionLabel === 'Save') {
        this.gradeService.createGrade(formData).subscribe(
          (response: Array<Grade>) => {
            console.log('POST-GRADE Request successful', response);
            this.router.navigate(['/master/grade']);
            this.designationService.notify('Grade Added successfully..!');
          },
          (error: any) => {
            if (error.status == 400) {
              this.gradeService.warn('Credentials already present');
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.gradeService.updateGrade(formData).subscribe(
          (response: Array<Grade>) => {
            console.log('PUT-GRADE Request successful', response);
            this.designationService.notify('GRADE Updated successfully..!');
            this.router.navigate(['/master/grade']);
          },
          (error: any) => {
            if (error.status == 400) {
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
}
