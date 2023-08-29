import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scope } from '../../../models/scope.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ScopeService } from '../../../services/scope.service';
import { leadingSpaceValidator } from '../Validations/leadingSpace.validator';
import { trailingSpaceValidator } from '../Validations/trailingSpace.validator';
import { nameMaxLength } from '../Validations/nameMaxLength.validator';
import { blankValidator } from '../Validations/blankData.validator';
import { whitespaceValidator } from '../Validations/whiteSpace.validator';

@Component({
  selector: 'app-scope-form',
  templateUrl: './scope-form.component.html',
  styleUrls: ['./scope-form.component.scss'],
})
export class ScopeFormComponent {
  scopeForm!: FormGroup;
  scope!: Scope;
  submitted: boolean = false;
  queryParams?: Params;
  actionLabel: string = 'Save';
  isDisabled: boolean = false;

  constructor(
    private _mdr: MatDialogRef<ScopeFormComponent>,
    private formBuilder: FormBuilder,
    private scopeService: ScopeService,
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

  goBack() {
    this.router.navigate(['/user/user-table']);
  }

  initForm() {
    this.scopeForm = this.formBuilder.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z\\s\\-_]+$'),
        ],
      ],
      displayName: [
        '',
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          whitespaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z\\s\\-_]+$'),
        ],
      ],
      iconUri: [''],
    });

    this.scopeForm.get('name')?.valueChanges.subscribe((nameValue) => {
      this.scopeForm.get('displayName')?.setValue(nameValue);
    });
  }

  get idControl() {
    return this.scopeForm.get('id');
  }
  get nameControl() {
    return this.scopeForm.get('name');
  }
  get displayNameControl() {
    return this.scopeForm.get('displayName');
  }
  get iconUriControl() {
    return this.scopeForm.get('iconUri');
  }

  onSubmit() {
    if (this.scopeForm.valid) {
      const formData = this.scopeForm.value;

      if (this.actionLabel === 'Save') {
        this.scopeService.createScope(formData).subscribe(
          (response: Scope) => {
            console.log('POST-SCOPE Request successful', response);
            this.router.navigate(['/user/scope-table']);
            this.scopeService.notify('Scope Added successfully..!');
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 404) {
              this.scopeService.warn('Scope already present');
            }
            console.error('POST Request failed', error);
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.scopeService.updateScope(formData).subscribe(
          (response: Scope) => {
            console.log('PUT-SCOPE Request successful', response);
            this.scopeService.notify('Scope Updated successfully..!');
            this.router.navigate(['/user/scope-table']);
            this.Close(true);
          },
          (error: any) => {
            if (error.status == 404) {
              this.scopeService.warn('Scope already present');
            }
            console.error('PUT Request failed', error);
          }
        );
      }
    }
  }

  getById(id: string) {
    this.scopeService.searchScopeById(id).subscribe((response: Scope) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.scopeForm.patchValue(response);
      this.scope = response;
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
