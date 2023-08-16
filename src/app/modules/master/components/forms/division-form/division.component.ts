import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
  isDisabled: boolean = false;

  constructor(
    private _mdr: MatDialogRef<DivisionComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
    public divisionService: DivisionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
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
    this.divisionForm = this.formBuilder.group({
      id: [''],
      divisionId: [
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
      divisionName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z0-9\\s\\-._]+$'),
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
          Validators.pattern('^[a-zA-Z0-9\\s\\-_]+$'),
          whitespaceValidator,
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
      this.divisionForm.get('divisionId')?.enable();
      const formData = this.divisionForm.value;
      formData.updatedBy = 'Admin';
      if (this.actionLabel === 'Save') {
        this.divisionService.createDivision(formData).subscribe(
          (response: Division) => {
            this.CloseDialog();
            this.divisionService.notify('Division Added Successfully...');
            this.router.navigate(['/master/division-table']);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.divisionService.warn('Division Id already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.divisionService.updateDivision(formData).subscribe(
          (response: Division) => {
            this.CloseDialog();
            this.divisionService.notify('Division Updated  Successfully...');
            this.router.navigate(['/master/division-table']);
          },
          (error: any) => {
            if (error.status == 400) {
              this.divisionService.warn('Division Id already present');
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

  CloseDialog() {
    console.log('inside close dialogue');
    this._mdr.close(false);
    this.router.navigate(['/master/division-table']);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
