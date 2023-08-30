import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CompanyDetailsService } from '../../../services/company-details.service';
import { CommonMaster } from '../../../models/common-master.model';
import { Department } from 'src/app/modules/master/models/department.model';
import { Grade } from 'src/app/modules/master/models/grade.model';
import { Role } from 'src/app/modules/master/models/role.model';
import { Employees } from '../../../models/employee.model';
import { Employee } from 'src/app/modules/master/models/employee.model';
import { Designation } from 'src/app/modules/master/models/designation.model';
import { DesignationService } from 'src/app/modules/master/services/designation.service';
import { RoleService } from 'src/app/modules/master/services/role.service';
import { DepartmentService } from 'src/app/modules/master/services/department.service';
import { GradeService } from 'src/app/modules/master/services/grade.service';
import { EmployeeTypeService } from 'src/app/modules/master/services/employee-type.service';
import { CompanyDetails } from '../../../models/company-details.model';
import { CustomValidators } from '../../../services/custom-validators.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  companyDetailsForm!: FormGroup;
  queryParams: any;
  defaultShifts: CommonMaster[] = [];
  billables: CommonMaster[] = [];
  probations: CommonMaster[] = [];
  departments: Department[] = [];
  grades: Grade[] = [];
  employeeTypes: Employee[] = [];
  roles: Role[] = [];
  employees: Employees[] = [];
  designations: Designation[] = [];
  actionLabel: String;
  companyDetailsId: number;
  response: number;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private companyDetailsService: CompanyDetailsService,
    private designationService: DesignationService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private employeeTypeService: EmployeeTypeService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchDepartments();
    this.fetchGrades();
    this.fetchEmployeeTypes();
    this.fetchRoles();
    this.fetchBillables();
    this.fetchProbatios();
    this.fetchDefaultShifts();
    this.fetchAllEmployees();
    this.fetchDesignations();
    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = params;
      this.getById(this.queryParams['id']);
    });
  }
  fetchDesignations() {
    this.designationService.getDesignations().subscribe((response) => {
      this.designations = response;
    });
  }
  fetchAllEmployees() {
    this.employeeService.getAllEmployee().subscribe((response) => {
      this.employees = response;
    });
  }
  fetchDefaultShifts() {
    this.companyDetailsService.getAllDefaultShift().subscribe((response) => {
      this.defaultShifts = response;
    });
  }
  fetchProbatios() {
    this.companyDetailsService.getAllProbations().subscribe((response) => {
      this.probations = response;
    });
  }
  fetchBillables() {
    this.companyDetailsService.getAllBillables().subscribe((response) => {
      this.billables = response;
    });
  }
  fetchRoles() {
    this.roleService.getRoles().subscribe((response) => {
      this.roles = response;
    });
  }
  fetchEmployeeTypes() {
    this.employeeTypeService.getEmployeeTypes().subscribe((response) => {
      this.employeeTypes = response;
    });
  }
  fetchDepartments() {
    this.departmentService.getDepartments().subscribe((response) => {
      this.departments = response;
    });
  }
  fetchGrades() {
    this.gradeService.getGrades().subscribe((response) => {
      this.grades = response;
    });
  }

  initForm() {
    this.companyDetailsForm = this.formBuilder.group({
      id: [''],
      designation: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      grade: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      department: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      role: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      reviewerManager: ['', Validators.required],
      reportingManager: ['', Validators.required],
      employeeType: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      billable: ['', Validators.required],
      probation: ['', Validators.required],
      // companyEmail: ['', Validators.required],
      // clientEmail: [''],
      companyEmail: [
        '',
        [
          Validators.required,
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
          ),
        ],
      ],
      clientEmail: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(50),
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
          ),
        ],
      ],
      shift: ['', Validators.required],
      orgCode: ['AVI01'],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onSubmit() {
    if (this.companyDetailsForm.valid) {
      const formData = this.companyDetailsForm.value;
      console.log(formData);
      if (this.actionLabel === 'Save') {
        this.companyDetailsService
          .createComapanyDetails(formData, this.queryParams.id)
          .subscribe(
            (response: CompanyDetails) => {
              this.companyDetailsService.notify('Data Saved Successfully...');
              this.actionLabel = 'Update';
              this.response = response.id;

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.employeeService.warn('Credentials already present');
              }
            }
          );
      }
      if (this.actionLabel === 'Update') {
        formData.id = this.response;
        debugger;
        this.companyDetailsService
          .updateCompanyDetails(formData, this.queryParams.id)
          .subscribe(
            (response: CompanyDetails) => {
              this.companyDetailsService.notify('Update Successfully...');
              this.queryParams.actionLabel = 'Update';
              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.companyDetailsService.warn('Credentials already present');
              }
            }
          );
      }
    }
  }

  getById(id: string) {
    // debugger;
    this.companyDetailsService.searchCompanyDetailsById(id).subscribe(
      (response: CompanyDetails) => {
        this.companyDetailsForm.patchValue(response);
        console.log(this.companyDetailsForm.value);
        this.response = response.id;
        this.actionLabel = 'Update';
      },
      (error) => {
        this.actionLabel = 'Save';
      }
    );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.companyDetailsForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.companyDetailsForm.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }
    return '';
  }
}
