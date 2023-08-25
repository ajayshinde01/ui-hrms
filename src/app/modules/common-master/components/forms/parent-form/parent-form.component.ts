import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parent } from '../../../models/parent';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { HttpParams } from '@angular/common/http';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { ChildService } from '../../../services/child.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent {
  @Output() sendDataEvnt = new EventEmitter<number>();

  childMetaData: { content: Array<Parent>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  childHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
  params: HttpParams = new HttpParams();

  parentForm!: FormGroup;
  parent!: Parent;
  submitted: boolean = false;
  queryParams?: Params;
  isEdit: boolean = false;
  isDisabled: boolean = false;
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
    // this.searchFunction(params);
  }

  getChildHeaders() {
    this.parentService.getParentsHeaders().subscribe(
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
        this.getById(this.queryParams['id']);
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
      masterName: [{ value: '', disabled: this.isDisabled }],
      code: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
      value: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
      createdBy: [''],
      master: ['true'],
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
            this.parentService.warn('Already present');
          }
          console.error('POST Request failed', error);
        }
      );
    }
  }

  action(event: Data) {
    let type: string = event['event'];
    let id: string = event['data'].roleId;
    const queryParam = { id: id };
    // switch (type) {
    //   case 'delete':
    //     this.childService.deleteChild(event['data'].roleId).subscribe(
    //       (response: ApiResponse) => {
    //         this.roleService.notify('Role deleted successfully');
    //         this.searchFunction(this.params);
    //         const currentPage = Number(this.params.get('page'));
    //         if (this.roleMetaData.content.length === 1 && currentPage > 0) {
    //           const newPage = currentPage - 1;
    //           this.params = this.params.set('page', newPage.toString());
    //           this.searchFunction(this.params);
    //         }
    //       },
    //       (error: any) => {
    //         console.error('DELETE-ROLE Request failed', error);
    //       }
    //     );
    //     break;
    //   case 'add':
    //     //this.OpenModal();
    //     this.router.navigate(['/master/role']);
    //     break;
    //   case 'edit':
    //     //this.OpenModalForEdit(id);
    //     this.router.navigate(['/master/role'], { queryParams: queryParam });
    //     break;
    // }
  }

  searchFunction(params: HttpParams) {
    this.params = params;
    this.childService
      .search(this.parent.masterName, params)
      .subscribe((data: { content: Array<Parent>; totalElements: number }) => {
        this.childMetaData = data;
      });
  }

  getById(id: string) {
    this.parentService.searchParentById(id).subscribe((response: Parent) => {
      console.log('GET-SEARCH BY ID Request successful', response);
      this.parentForm.patchValue(response);
      this.parent = response;
      this.parent.masterName = response.masterName;
      console.log(this.parent.masterName);
      console.log(this.parent);
      this.searchFunction(this.params);
    });
  }

  resetForm() {
    this.collectQueryParams();
    this.initForm();
  }

  // OpenModalForEdit(data: string) {
  //       this.matDialogRef = this.matDialog.open(RoleFormComponent, {
  //         data: { id: data },
  //         disableClose: true,
  //       });

  //       this.matDialogRef.afterClosed().subscribe((res: any) => {
  //         this.searchFunction(this.params);
  //         if (res == true) {
  //         }
  //       });
  //     }
  //   }
}
