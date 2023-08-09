import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DesignationService } from '../../../services/designation.service';
import { MatDialog } from '@angular/material/dialog';
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
  actionLabel: string = 'Save';
  constructor(
    private formBuilder: FormBuilder,
    private designationService: DesignationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
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

  goBack() {
    this.router.navigate(['/master/designation']);
  }
  initForm() {
    this.designationForm = this.formBuilder.group({
      id: [''],
      designationId: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          idMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-]+$'),
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
      const formData = this.designationForm.value;

      if (this.actionLabel === 'Save') {
        this.designationService.createDesignation(formData).subscribe(
          (response: Array<Designation>) => {
            console.log('POST-ROLE Request successful', response);
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
        this.designationService.updateDesignation(formData).subscribe(
          (response: Array<Designation>) => {
            console.log('PUT-ROLE Request successful', response);
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
    console.log('get by id');
    this.designationService
      .searchDesignationById(id)
      .subscribe((response: Designation) => {
        console.log('GET-SEARCH BY ID Request successful', response);
        this.designationForm.patchValue(response);
        console.log(this.designationForm.value);
        this.designation = response;
      });
  }
}
