import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { Observable } from 'rxjs';
import { Division } from '../../../models/division.model';
import { DivisionService } from '../../../services/division.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PopupComponent } from '../../helper/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';
import { descMaxLength } from '../Validations/descMaxLength.validator';
import { idMaxLength } from '../Validations/idMaxLength.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
})
export class DivisionComponent {
  divisionForm!: FormGroup;
  division: Division;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  constructor(
    public divisionService: DivisionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
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
  goBack() {
    this.router.navigate(['/master/division-table']);
  }
  initForm() {
    this.divisionForm = this.formBuilder.group({
      id: [''],
      divisionId: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          idMaxLength,
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d-]*[A-Za-z\\d]$'),
        ],
      ],
      divisionName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d _.-]*[A-Za-z\\d]$|^$'),
        ],
      ],
      divisionDescription: [
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
          Validators.pattern('^[A-Za-z\\d][A-Za-z\\d-_]*[A-Za-z\\d]$'),
        ],
      ],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }
  onSubmit() {
    if (this.divisionForm.valid) {
      const formData = this.divisionForm.value;
      if (this.actionLabel === 'Save') {
        this.divisionService.createDivision(formData).subscribe(
          (response: Division) => {
            this.divisionService.notify('Division Added Successfully...');
            this.router.navigate(['/master/division-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.divisionService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.divisionService.updateDivision(formData).subscribe(
          (response: Division) => {
            this.divisionService.notify('Division Updated  Successfully...');
            this.router.navigate(['/master/division-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.divisionService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
  getById(id: string) {
    this.divisionService
      .searchDivisionById(id)
      .subscribe((response: Division) => {
        console.log('GET-SEARCH BY ID Request successful', response);
        this.divisionForm.patchValue(response);
        this.division = response;
      });
  }
}
