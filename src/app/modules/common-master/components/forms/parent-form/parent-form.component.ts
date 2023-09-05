import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parent } from '../../../models/parent';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { HttpParams } from '@angular/common/http';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { ChildService } from '../../../services/child.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChildFormComponent } from '../child-form/child-form.component';
import { ApiResponse } from '../../../models/response';
import { leadingSpaceValidator } from 'src/app/modules/master/components/forms/Validations/leadingSpace.validator';
import { nameMaxLength } from 'src/app/modules/master/components/forms/Validations/nameMaxLength.validator';
import { trailingSpaceValidator } from 'src/app/modules/master/components/forms/Validations/trailingSpace.validator';
import { whitespaceValidator } from 'src/app/modules/master/components/forms/Validations/whiteSpace.validator';
import { blankValidator } from 'src/app/modules/master/components/forms/Validations/blankData.validator';
import { Subscription } from 'rxjs';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();
  buttonVisible: Array<boolean> = [true, true, true];
  matDialogRef: MatDialogRef<ChildFormComponent>;

  childMetaData: { content: Array<Parent>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  childHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  masterName: string = '';
  parentForm!: FormGroup;
  parent!: Parent;
  submitted: boolean = false;
  queryParams?: Params;
  isEdit: boolean = false;
  errorMessage: string = '';
  dataTableHeight = '1';
  private queryParamsSubscription: Subscription;

  isDisabled: boolean = false;
  id: number;
  constructor(
    private formBuilder: FormBuilder,
    private parentService: ParentService,
    private router: Router,
    private route: ActivatedRoute,
    private childService: ChildService,
    private matDialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.collectQueryParams();
    this.initForm();
    this.getChildHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    console.log('inside ngoInit', this.id);
  }

  getChildHeaders() {
    this.childService.getChildHeaders().subscribe(
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
        console.log('GET-HEADERS Request successful', response);
        this.childHeaders = response;
        console.log(this.childHeaders);
      },
      (error: any) => {
        console.error('GET Request failed', error);
      }
    );
  }

  collectQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams['id'] != undefined) {
        this.isEdit = true;
        this.isDisabled = true;
        this.id = this.queryParams['id'];
        this.getById(this.id);
      } else {
      }
    });
  }

  goBack() {
    this.router.navigate(['/common-master/parent']);
  }
  initForm() {
    this.parentForm = this.formBuilder.group({
      id: [''],
      masterName: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z\\s]+$'),
        ],
      ],
      code: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          Validators.pattern('^[a-zA-Z\\s\\_.+-]+$'),
          whitespaceValidator,
        ],
      ],
      value: [
        { value: '', disabled: this.isDisabled },
        [
          Validators.required,
          leadingSpaceValidator,
          trailingSpaceValidator,
          nameMaxLength,
          blankValidator,
          Validators.pattern('^[a-zA-Z\\s.+-]+$'),
        ],
      ],
      createdBy: [''],
      master: ['true'],
    });

    this.parentForm.get('value')?.valueChanges.subscribe((newValue) => {
      const formattedValue = newValue.toUpperCase().replace(/ /g, '_');
      this.parentForm.get('code')?.setValue(formattedValue);
    });
  }

  get idControl() {
    return this.parentForm.get('id');
  }
  get masterNameControl() {
    return this.parentForm.get('masterName');
  }
  get codeControl() {
    return this.parentForm.get('code');
  }
  get valueControl() {
    return this.parentForm.get('value');
  }
  get createdByControl() {
    return this.parentForm.get('createdBy');
  }
  get masterControl() {
    return this.parentForm.get('master');
  }

  onSubmit() {
    this.parentForm.get('code')?.enable();
    if (this.parentForm.valid) {
      const formData = this.parentForm.value;

      this.parentService.createParent(formData).subscribe(
        (response: Parent) => {
          console.log('POST-PARENT Request successful', response);
          this.router.navigate(['/common-master/parent']);
          this.parentService.notify('Parent added successfully');
        },
        (error: any) => {
          if (error.status == 400) {
            this.errorMessage = error.error.message;
            this.parentService.warn(this.errorMessage);
          }
          console.error('POST Request failed', error);
        }
      );
    }
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: number = event['data'].id;
    this.id = event['data'].id;
    switch (type) {
      case 'delete':
        this.childService.deleteChild(event['data'].id).subscribe(
          (response: ApiResponse) => {
            this.childService.notify('Child deleted successfully');
            this.searchFunction(this.params);
            const currentPage = Number(this.params.get('page'));
            if (this.childMetaData.content.length === 1 && currentPage > 0) {
              const newPage = currentPage - 1;
              this.params = this.params.set('page', newPage.toString());
              this.searchFunction(this.params);
            }
          },
          (error: any) => {
            console.error('DELETE-CHILD Request failed', error);
          }
        );
        break;
      case 'add':
        this.OpenModal();
        this.router.navigate(['/common-master/parentForm']);
        break;
      case 'edit':
        console.log(this.id);
        if (this.id != 0) {
          this.OpenModal();
          this.router.navigate(['/common-master/parentForm']);
        } else this.childService.notify('Please select a record to edit');

        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.childService
      .search(this.parent.masterName, params)
      .subscribe((data: { content: Array<Parent>; totalElements: number }) => {
        this.childMetaData = data;
      });
  }

  getById(id: number) {
    this.parentService.searchParentById(id).subscribe((response: Parent) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.parentForm.patchValue(response);
      this.parent = response;
      this.parent.masterName = response.masterName;

      this.searchFunction(this.params);
    });
  }

  OpenModal() {
    this.matDialogRef = this.matDialog.open(ChildFormComponent, {
      data: { id: this.id, masterName: this.parent.masterName },
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
      }
    });
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }
}
