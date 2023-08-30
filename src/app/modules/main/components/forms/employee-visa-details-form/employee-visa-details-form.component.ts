import { HttpParams } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Data, Router } from '@angular/router';
import { Visa } from 'src/app/modules/main/models/visa.model';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { CommonMaster } from '../../../models/common-master.model';
import { CustomValidators } from '../../../services/custom-validators.service';

@Component({
  selector: 'app-employee-visa-details-form',
  templateUrl: './employee-visa-details-form.component.html',
  styleUrls: ['./employee-visa-details-form.component.scss']
})
export class EmployeeVisaDetailsFormComponent implements OnInit {
  params: HttpParams = new HttpParams();
  selectedProduct: any;
  @Input() inputFromParent : string;
  employeeVisaDetailsForm!: FormGroup;
  queryParams?: Params;
  isDisabled: boolean = false;
  country_codes: CommonMaster[] = [];
  actionLabel: string = 'Save';
  visa: Visa;
  emp_id:any;
  visaid:number;
  files: File[];
  visaFile:any;
  FleSizeError: string='';
  constructor(
    private _mdr: MatDialogRef<EmployeeVisaDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Visa,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
   // this.emp_id = this.route.snapshot.paramMap.get("id");
    this.emp_id = this.route.snapshot.queryParamMap.get('id'); // Replace 'paramName' with the actual query parameter name
   // console.log("visaid", this.visaid);   
    this.initForm();    
    this.fetchCountryCode();
    this.collectQueryParams();
    console.log("dfd",this.inputFromParent);
    console.log('Query parameter value:', this.emp_id);
   
  }

  initForm() {
      this.employeeVisaDetailsForm = this.formBuilder.group({
        id: [''],
        countryCode:['', Validators.required],
        orgCode:['AVI-123'],
        //visaNumber:[''],
        visaNumber:['', [
         Validators.required,
         CustomValidators.noLeadingSpace(),
         CustomValidators.whitespaceValidator(),
         CustomValidators.noTrailingSpace(),
        // CustomValidators.maxLength(16),
        // Validators.pattern('^4[0-9]{12}(?:[0-9]{3})?$'),
        ]
       ],
        visaFile:[''],
        validDate:['', Validators.required],
        
      });
    }

    collectQueryParams() {
     /* this.route.queryParams.subscribe((params) => {
        this.queryParams = params;
  
        if (this.queryParams['id'] != undefined) {
          console.log(this.queryParams['id']);
          this.actionLabel = 'Update';
          this.getById(this.queryParams['id']);
          this.isDisabled = true;
        } else {
          this.actionLabel = 'Save';
        }
      });*/
      if (this.emp_id != undefined) {
        console.log(this.emp_id);
        this.actionLabel = 'Update';
        this.getById(this.emp_id);
        this.isDisabled = true;
      } else {
        this.actionLabel = 'Save';
      }

    }

    getById(id: string) {
      this.visaid=this.data.id;
      this.employeeService
        .searchVisaById(this.emp_id, this.visaid)
        .subscribe((response: Visa) => {
          this.employeeVisaDetailsForm.patchValue(response);
          this.employeeVisaDetailsForm.controls["countryCode"].patchValue(response.countryCode)
          this.visa = response;
        });
    }

  fetchCountryCode() {
    this.employeeService.getCountryCode().subscribe((Response: Array<CommonMaster>)=>{
      this.country_codes =Response;
      console.log("country_code",this.country_codes);
    })
  }

  Close(isUpdate: boolean) {
    this._mdr.close(isUpdate);
  }

  
  openVisaFileInput(visaFileInput: any) {
    visaFileInput.click();
  }
  onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      this.files = event.target.files[0];
      //this.employeeVisaDetailsForm.get('visaFile').setValue(this.files);
      console.log(this.files);
      const file = event.target.files[0];
      console.log('size', file.size);
      console.log('type', file.type);
      if(file.size > 2e+6){
        this.FleSizeError='File is too large should not exceed Over 2MB';
        console.log('File is too large. Over 2MB');
      }
    }
  }

  onSubmit() {
    if (this.employeeVisaDetailsForm.valid) {
      
      const formData = this.employeeVisaDetailsForm.value;
     
      formData["visaFile"]= this.files;

      if (this.actionLabel === 'Save') {
        this.employeeService.AddVisaDetails(formData,this.emp_id).subscribe(
          (response: Visa) => {
            this.employeeService.notify('Data Saved Successfully...');
            this.router.navigate(['/main/employee-form']);

            
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
      if (this.actionLabel === 'Update') {
        this.employeeService.updateEmployeevisa(formData, this.emp_id).subscribe(
          (response: Visa) => {
            this.employeeService.notify('Update Successfully...');
           this.router.navigate(['/main/employee-info'], {
              queryParams: { id: this.emp_id, actionLabel: 'Save' },
            });
          },
          (error: any) => {
            if (error.status == 400 || error.status == 404) {
              this.employeeService.warn('Credentials already present');
            }
          }
        );
      }
    }
  }

  onresetForm(){
    this.employeeVisaDetailsForm.reset();
  }

}
