import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PopupContentComponent } from '../../helper/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { leadingSpaceValidator } from '../validations/leading-space.validator';
import { trailingSpaceValidator } from '../validations/trailing-space.validator';
import { whitespaceValidator } from '../validations/white-space.validator';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  department: Department;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  constructor(public departmentService: DepartmentService, private formBuilder: FormBuilder,   private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams['id'] != undefined) {
        this.actionLabel = 'Update';
        this.getById(this.queryParams['id']);
      } else {
        this.actionLabel = 'Save';
      }
    });
  }

  initForm() {
    this.departmentForm = this.formBuilder.group({
      id:[''],
      departmentId: [
        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
      Validators.pattern('^(?!.*s)[A-Za-z]{1,50}$')
    ]],
      departmentName: [
        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
      Validators.pattern('^[a-zA-Z-_ ]{1,100}$')
    ]],
      departmentDescription: [
        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
      Validators.pattern('^[a-zA-Z0-9 ]{1,250}$')]
    ],
      orgCode: [
        '',[
        Validators.required,
        leadingSpaceValidator,
        trailingSpaceValidator,
        whitespaceValidator,
      Validators.pattern('^[a-zA-Z-_]{1,10}$')]
    ],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt:[null],
      updatedAt:[null]

    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      const formData = this.departmentForm.value;
      if (this.actionLabel === 'Save') {
        this.departmentService.createDepartment(formData).subscribe(
          (response: Department) => {
            this.departmentService.notify("Save Successfully...");
            this.router.navigate(['/master/department-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.departmentService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.departmentService.updateDepartment(formData).subscribe(
          (response: Department) => {
            this.departmentService.notify("Update Successfully...");
            this.router.navigate(['/master/department-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.departmentService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
  getById(id: string) {
    this.departmentService.searchDepartmentById(id).subscribe((response: Department) => {
      this.departmentForm.patchValue(response);
      this.department = response;
    });
  }

}








