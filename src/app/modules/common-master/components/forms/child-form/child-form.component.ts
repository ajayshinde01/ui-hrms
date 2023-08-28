import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Parent } from '../../../models/parent';
import { ChildService } from '../../../services/child.service';
import { leadingSpaceValidator } from 'src/app/modules/master/components/forms/Validations/leadingSpace.validator';
import { trailingSpaceValidator } from 'src/app/modules/master/components/forms/Validations/trailingSpace.validator';
import { whitespaceValidator } from 'src/app/modules/master/components/forms/Validations/whiteSpace.validator';
import { priorityMaxLength } from 'src/app/modules/master/components/forms/Validations/priorityMaxLength.validator';
import { nameMaxLength } from 'src/app/modules/master/components/forms/Validations/nameMaxLength.validator';
import { blankValidator } from 'src/app/modules/master/components/forms/Validations/blankData.validator';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent {
  childForm!: FormGroup;
  child: Parent;
  submitted: boolean = false;
  queryParams?: Params;
  isDisabled: boolean = false;
  errorMessage: string = '';
  masterName: string = '';
  d: any;
  actionLabel: string = 'Save';
  constructor(
    private _mdr: MatDialogRef<ChildFormComponent>,
    private childService: ChildService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log('Received data in child:', this.data);
    this.initForm();
    this.collectData();
  }

  collectData() {
    console.log('Data', this.data.id);

    if (this.data.id != undefined) {
      this.actionLabel = 'Update';
      this.getById(this.data.id);
      this.isDisabled = true;
    } else {
      this.actionLabel = 'Save';
      this.isDisabled = true;
    }
  }

  initForm() {
    this.childForm = this.formBuilder.group({
      id: [''],
      masterName: [this.data.masterName],
      code: [
        { value: '', disabled: true },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z\\s\\_]+$'),
          whitespaceValidator,
        ],
      ],
      value: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z\\s]+$'),
        ],
      ],
      createdBy: ['Admin'],
      priority: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          priorityMaxLength,
          Validators.pattern('^[0-9\\s]+$'),
          whitespaceValidator,
        ],
      ],
      foreignKey: [
        '',
        [
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z\\s]+$'),
          whitespaceValidator,
        ],
      ],
      master: ['false'],
    });

    this.childForm.get('value')?.valueChanges.subscribe((newValue) => {
      const formattedValue = newValue.toUpperCase().replace(/ /g, '_');
      this.childForm.get('code')?.setValue(formattedValue);
    });
  }

  get masterNameControl() {
    return this.childForm.get('masterName');
  }

  onSubmit() {
    if (this.childForm.valid) {
      console.log('child form valid');
      this.childForm.get('masterName')?.enable();
      this.childForm.get('code')?.enable();
      const formData = this.childForm.value;
      formData.updatedBy = 'Admin';

      if (this.actionLabel === 'Save') {
        this.childService.createChild(formData).subscribe(
          (response: Parent) => {
            this.childService.notify('Child added Successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.errorMessage = error.error.message;
              this.childService.warn(this.errorMessage);
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        formData.updatedBy = 'Admin';
        this.childService.updateChild(formData).subscribe(
          (response: Parent) => {
            this.childService.notify('Child updated Successfully');

            this.Close(true);
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.childService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }
  getById(id: number) {
    this.childService
      .searchChildById(this.data.id)
      .subscribe((response: Parent) => {
        this.childForm.patchValue(response);
        //this.child = response;
        this.masterName = this.childForm.value.masterName;
      });
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  resetForm() {
    this.collectData();
    this.initForm();
  }
}
