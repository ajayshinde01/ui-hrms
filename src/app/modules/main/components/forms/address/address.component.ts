import { Component, OnInit } from '@angular/core';
import { CommonMaster } from '../../../models/common-master.model';
import { Address } from '../../../models/address.model';
import { EmployeeService } from '../../../services/employee.service';
import { AddressService } from '../../../services/address.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Employees } from '../../../models/employee.model';
import { mergeMap } from 'rxjs';
import { state } from '@angular/animations';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  addressForm!: FormGroup;
  employee: Employees;
  address: Address;
  addressTypes: CommonMaster[] = [];
  ownershipStatus: CommonMaster[] = [];
  countries: CommonMaster[] = [];
  states: CommonMaster[] = [];
  cities: CommonMaster[] = [];
  submitted: boolean = false;
  queryParams?: any;
  response: number;
  actionLabel: string;
  isDisabled: boolean = false;

  constructor(
    public employeeService: EmployeeService,
    public addressService: AddressService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getFetchAddressTypes();
    this.FetchOwnershipStatus();
    this.FetchCountries();

    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
    if (this.queryParams.actionLabel == 'Update') {
      this.getById(this.queryParams['id']);
      this.getCities();
      this.getStates();
      this.actionLabel = 'Save';
      // this.addressForm.controls['employeeId'].setValue(this.queryParams.id);
    } else {
      this.actionLabel = 'Save';
    }
  }

  // this.addressForm.controls['employeeId'].setValue(this.queryParams.id);

  initForm() {
    this.addressForm = this.formBuilder.group({
      id: [''],
      addressType: [''],
      address1: [''],
      address2: [''],
      landmark: [''],
      tenureYear: [''],
      tenureMonth: [''],
      city: [''],
      state: [''],
      country: [''],
      postcode: [''],
      ownershipStatus: [''],
      orgCode: ['AVI-IND'],
      createdBy: ['Admin'],
      updatedBy: ['Admin'],
      createdAt: [null],
      updatedAt: [null],
    });
  }

  onCountrySelectionChange(event: any) {
    console.log('onSelect');
    const Code = event.value; // Get the selected country code from the event
    this.FetchStates(Code); // Call FetchStates with the selected country code
  }

  onStateSelectionChange(event: any) {
    const code = event.value;
    this.FetchCities(code);
  }

  FetchOwnershipStatus() {
    this.addressService
      .getOwnershipStatus()
      .subscribe((Response: CommonMaster[]) => {
        this.ownershipStatus = Response;
        console.log(this.ownershipStatus);
      });
  }

  getFetchAddressTypes() {
    this.addressService
      .getAddressType()
      .subscribe((Response: CommonMaster[]) => {
        this.addressTypes = Response;
        console.log(this.addressTypes);
      });
  }

  FetchCountries() {
    this.addressService.getCountry().subscribe((Response: CommonMaster[]) => {
      this.countries = Response;
      console.log(this.countries);
    });
  }

  FetchStates(Code: string) {
    this.addressService.getState(Code).subscribe((Response: CommonMaster[]) => {
      this.states = Response;
      console.log(this.states);
    });
  }
  getStates() {
    this.addressService.allState().subscribe((Response: CommonMaster[]) => {
      this.states = Response;
      console.log(this.states);
    });
  }

  getCities() {
    this.addressService.allCity().subscribe((Response: CommonMaster[]) => {
      this.cities = Response;
      console.log(this.cities);
    });
  }

  FetchCities(code: string) {
    this.addressService.getCity(code).subscribe((Response: CommonMaster[]) => {
      this.cities = Response;
      console.log(this.cities);
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      if (this.actionLabel === 'Save') {
        debugger;
        this.addressService
          .createAddress(formData, this.queryParams.id)
          .subscribe(
            (response: Address) => {
              this.addressService.notify('Save Successfully...');
              this.actionLabel = 'Update';
              this.response = response.id;
              this.queryParams = {
                id: this.queryParams.id,
                actionLabel: 'Update',
              };
              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.addressService.warn('Credentials already present');
              }
            }
          );
      }
      if (this.actionLabel === 'Update') {
        formData.id = this.response;
        this.addressService
          .updateAddress(formData, this.queryParams.id)
          .subscribe(
            (response: Address) => {
              this.addressService.notify('Update Successfully...');
              this.queryParams.actionLabel = 'Update';
              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.addressService.warn('Credentials already present');
              }
            }
          );
      }
    }
  }
  getById(id: string) {
    this.addressService.getAddressById(id).subscribe((response: Address) => {
      console.log(response);
      this.addressForm.patchValue({
        id: response.id,
        addressType: response.addressType,
        address1: response.address1,
        address2: response.address2,
        landmark: response.landmark,
        tenureYear: response.tenureYear,
        tenureMonth: response.tenureMonth,
        city: response.city,
        state: response.state,
        country: response.country,
        postcode: response.postcode,
        ownershipStatus: response.ownershipStatus,
      });

      this.response = response.id;
      debugger;
      if (this.response != undefined) {
        this.actionLabel = 'Update';
      } else {
        this.actionLabel = 'Save';
      }
    });
  }
}
