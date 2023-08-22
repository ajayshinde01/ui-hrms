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
import { blankValidator } from '../Validations/blankData.validator';

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
  errorMessage: string = '';

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
    this.divisionForm
      .get('divisionId')
      ?.valueChanges.subscribe((value: string) => {
        this.divisionForm
          .get('divisionId')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.divisionForm
      .get('orgCode')
      ?.valueChanges.subscribe((value: string) => {
        this.divisionForm
          .get('orgCode')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      });

    this.divisionForm
      .get('divisionName')
      ?.valueChanges.subscribe((value: string) => {
        if (value.length > 0) {
          const firstLetter = value.charAt(0).toUpperCase();

          const restOfValue = value.slice(1);

          const newValue = firstLetter + restOfValue;

          this.divisionForm
            .get('divisionName')
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
          blankValidator,
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
          blankValidator,
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
            this.divisionService.notify('Division added Successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400) {
              this.errorMessage = error.error.message;
              this.divisionService.warn(this.errorMessage);
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.divisionService.updateDivision(formData).subscribe(
          (response: Division) => {
            this.divisionService.notify('Division updated  Successfully');
            this.Close(true);
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

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
