import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  ) { }

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
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (
        this.queryParams['id'] != undefined &&
        this.queryParams.actionLabel == 'Update'
      ) {
        this.actionLabel = 'Update';
        this.companyDetailsForm.controls['employeeId'].setValue(
          this.queryParams.id
        );
        // this.getById(this.queryParams['id']);
      } else {
        this.actionLabel = 'Save';
        this.companyDetailsForm.controls['employeeId'].setValue(
          this.queryParams.id
        );
      }
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
      employeeId: [''],
      designation: this.formBuilder.group({
        id: [''],
      }),
      grade: this.formBuilder.group({
        id: [''],
      }),
      department: this.formBuilder.group({
        id: [''],
      }),
      role: this.formBuilder.group({
        id: [''],
      }),
      reviewerManager: [''],
      reportingManager: [''],
      employeeType: this.formBuilder.group({
        id: [''],
      }),
      billable: [''],
      probation: [''],
      companyEmail: [''],
      clientEmail: [''],
      shift: [''],
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
              this.router.navigate(['/main/company-details-form']);
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.employeeService.warn('Credentials already present');
              }
            }
          );
      }
      // if (this.actionLabel === 'Update') {
      //   this.employeeService.updateEmployee(formData).subscribe(
      //     (response: Employees) => {
      //       this.employeeService.notify('Update Successfully...');
      //       this.router.navigate(['/main/employee-table']);
      //     },
      //     (error: any) => {
      //       if (error.status == 400 || error.status == 404) {
      //         this.employeeService.warn('Credentials already present');
      //       }
      //     }
      //   );
      // }
    }
  }
}
