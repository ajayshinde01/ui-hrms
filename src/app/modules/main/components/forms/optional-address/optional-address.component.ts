import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employees } from '../../../models/employee.model';
import { Address } from '../../../models/address.model';
import { CommonMaster } from '../../../models/common-master.model';
import { EmployeeService } from '../../../services/employee.service';
import { AddressService } from '../../../services/address.service';
import { HttpClient } from '@angular/common/http';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../../../services/custom-validators.service';

@Component({
  selector: 'app-optional-address',
  templateUrl: './optional-address.component.html',
  styleUrls: ['./optional-address.component.scss'],
})
export class OptionalAddressComponent {
  optionalAddressForm!: FormGroup;
  employee: Employees;
  address: Address;
  ownershipStatus: CommonMaster[] = [];
  countries: CommonMaster[] = [];
  states: CommonMaster[] = [];
  cities: CommonMaster[] = [];
  submitted: boolean = false;
  queryParams?: any;
  response: number;
  addressType: string = 'CORRESPONDENCE';
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
    this.FetchOwnershipStatus();
    this.FetchCountries();

    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = params;
      this.getByIdAndAddressType(this.queryParams['id'], this.addressType);
      this.getCities();
      this.getStates();
    });
  }

  initForm() {
    this.optionalAddressForm = this.formBuilder.group({
      id: [''],
      addressType: [''],
      address1: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9.,-/#+ ]+$'),
        ],
      ],
      address2: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9.,-/#+ ]+$'),
        ],
      ],
      landmark: [
        '',
        [CustomValidators.noLeadingSpace(), CustomValidators.noTrailingSpace()],
      ],
      tenureYear: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(2),
          Validators.pattern('^[0-9]{1,2}$'),
        ],
      ],
      tenureMonth: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(2),
          Validators.pattern('^(?:[0-9]|1[0-2])$'),
        ],
      ],
      city: [''],
      state: [''],
      country: [''],
      postcode: [
        '',
        [
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(6),
          Validators.pattern('^[0-9]{6}$'),
        ],
      ],
      ownershipStatus: ['', [Validators.required]],
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
    if (this.optionalAddressForm.valid) {
      const formData = this.optionalAddressForm.value;
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
                this.addressService.warn('Please fill address details');
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
              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },
            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.addressService.warn('Please fill valid details');
              }
            }
          );
      }
    }
  }
  getByIdAndAddressType(id: number, addressType: string) {
    this.addressService.getAddressById(id, addressType).subscribe(
      (response: Address) => {
        this.optionalAddressForm.patchValue(response);
        this.response = response.id;
        this.actionLabel = 'Update';
      },
      (error) => {
        this.actionLabel = 'Save';
      }
    );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.optionalAddressForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.optionalAddressForm.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName);
    }
    return '';
  }
}
