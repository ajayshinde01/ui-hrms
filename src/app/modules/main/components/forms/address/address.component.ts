import { Component, OnInit, SimpleChanges } from '@angular/core';

import { CommonMaster } from '../../../models/common-master.model';

import { Address } from '../../../models/address.model';

import { EmployeeService } from '../../../services/employee.service';

import { AddressService } from '../../../services/address.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { Params, Router, ActivatedRoute } from '@angular/router';

import { Employees } from '../../../models/employee.model';

import { forkJoin, mergeMap } from 'rxjs';

import { state } from '@angular/animations';

import { CustomValidators } from '../../../services/custom-validators.service';

import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-address',

  templateUrl: './address.component.html',

  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  permanentAddressForm!: FormGroup;

  correspondenceAddressForm!: FormGroup;

  orgCode = sessionStorage.getItem('orgCode');

  employee: Employees;

  address: Address;

  addressType: string;

  corrId: number;

  checked: boolean = false;

  isDisabled: boolean = false;

  ownershipStatus: CommonMaster[] = [];

  corresCountries: CommonMaster[] = [];

  permCountries: CommonMaster[] = [];

  permStates: CommonMaster[] = [];

  corrStates: CommonMaster[] = [];

  corresCities: CommonMaster[] = [];

  permCities: CommonMaster[] = [];

  submitted: boolean = false;

  queryParams?: any;

  response: number;

  actionLabel: string;

  constructor(
    public employeeService: EmployeeService,

    public addressService: AddressService,

    private formBuilder: FormBuilder,

    private router: Router,

    private route: ActivatedRoute,

    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initForm();

    // this.getFetchAddressTypes();

    this.FetchOwnershipStatus();

    this.FetchCountries();

    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = params;

      // this.getByIdAndAddressType(this.queryParams['id'], this.addressType);

      this.getAllAddressById(this.queryParams['id']);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.initForm();
    this.getAllAddressById(this.queryParams['id']);
    debugger;
    this.onCopyAddress();
  }

  initForm() {
    this.permanentAddressForm = this.formBuilder.group({
      id: [''],

      addressType: ['permanent'],

      address1: [
        '',

        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9.,-/#+ ]+$'),
        ],
      ],

      address2: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(100),
          Validators.pattern('^[A-Za-z0-9.,-/#+ ]+$'),
        ],
      ],

      landmark: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
        ],
      ],

      tenureYear: [
        '',

        [
          CustomValidators.whitespaceValidator(),

          CustomValidators.maxLength(2),

          Validators.pattern('^[0-9]{1,2}$'),
        ],
      ],

      tenureMonth: [
        '',

        [
          CustomValidators.whitespaceValidator(),

          CustomValidators.noTrailingSpace(),

          CustomValidators.maxLength(2),

          Validators.pattern('^(?:0?[0-9]|1[0-1])$'),
        ],
      ],

      city: ['', [Validators.required]],

      state: ['', [Validators.required]],

      country: ['', [Validators.required]],

      postcode: [
        '',

        [
          Validators.required,
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(6),
          Validators.pattern('^[0-9]{6}$'),
        ],
      ],

      ownershipStatus: ['', [Validators.required]],

      orgCode: this.orgCode,

      createdBy: ['Admin'],

      updatedBy: ['Admin'],

      createdAt: [null],

      updatedAt: [null],
    });

    this.correspondenceAddressForm = this.formBuilder.group({
      id: [''],

      addressType: ['correspondence'],

      address1: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),

          CustomValidators.noTrailingSpace(),

          CustomValidators.maxLength(100),

          Validators.pattern('^[A-Za-z0-9.,-/#+ ]+$'),
        ],
      ],

      address2: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
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
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.maxLength(2),
          Validators.pattern('^[0-9]{1,2}$'),
        ],
      ],

      tenureMonth: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.maxLength(2),
          Validators.pattern('^(?:0?[0-9]|1[0-1])$'),
        ],
      ],

      city: [''],

      state: [''],

      country: [''],

      postcode: [
        '',

        [
          CustomValidators.noLeadingTrailingSpace(),
          CustomValidators.noLeadingSpace(),
          CustomValidators.whitespaceValidator(),
          CustomValidators.noTrailingSpace(),
          CustomValidators.maxLength(6),
          Validators.pattern('^[0-9]{6}$'),
        ],
      ],

      ownershipStatus: [''],

      orgCode: this.orgCode,

      createdBy: ['Admin'],

      updatedBy: ['Admin'],

      createdAt: [null],

      updatedAt: [null],
    });

    this.permanentAddressForm.valueChanges.subscribe((values) => {
      // Automatically uncheck the checkbox when any field changes
      this.checked = false;
      this.isDisabled = false;
    });
  }

  onCopyAddress() {
    this.checked = true;
    this.isDisabled = true;
    if (this.permanentAddressForm.valid) {
      forkJoin({
        corrStates: this.addressService.getState(
          this.permanentAddressForm.controls['country'].value
        ),
        corresCity: this.addressService.getCity(
          this.permanentAddressForm.controls['state'].value
        ),
      }).subscribe((response) => {
        this.corrStates = response.corrStates;
        this.corresCities = response.corresCity;
      });
      this.correspondenceAddressForm.patchValue(
        this.permanentAddressForm.value
      );
      this.getAllAddressById(this.queryParams['id']);
      this.correspondenceAddressForm.value.addressType = 'correspondence';
      this.correspondenceAddressForm.value.id = this.corrId;
      debugger;
    }
  }

  onPermanentCountryChange(event: any) {
    const code = event.value;

    this.addressService.getState(code).subscribe((Response: CommonMaster[]) => {
      this.permStates = Response;
    });
  }

  onPermanentStatesChange(event: any) {
    const code = event.value;

    this.addressService.getCity(code).subscribe((Response: CommonMaster[]) => {
      this.permCities = Response;
    });
  }

  onCorrespondenceCountryChange(event: any) {
    const code = event.value;

    this.addressService.getState(code).subscribe((Response: CommonMaster[]) => {
      this.corrStates = Response;
    });
  }

  onCorrespondenceStatesChange(event: any) {
    const code = event.value;

    this.addressService.getCity(code).subscribe((Response: CommonMaster[]) => {
      this.corresCities = Response;
    });
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
    forkJoin({
      corrCountries: this.addressService.getCountry(),

      permCountries: this.addressService.getCountry(),
    }).subscribe((response) => {
      this.corresCountries = response.corrCountries;

      this.permCountries = response.permCountries;
    });
  }

  onSubmit() {
    if (this.permanentAddressForm.valid) {
      const formDataArray = [
        this.permanentAddressForm.value,

        this.correspondenceAddressForm.value,
      ];

      if (this.actionLabel === 'Save') {
        this.addressService

          .createAddress(formDataArray, this.queryParams.id)

          .subscribe(
            (response: Address[]) => {
              this.addressService.notify('Address added successfully');

              this.actionLabel = 'Update';

              this.permanentAddressForm.patchValue(response[0]);

              this.correspondenceAddressForm.patchValue(response[1]);

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.addressService.warn(error.error.message);
              }
            }
          );
      }

      if (this.actionLabel === 'Update') {
        this.addressService

          .updateAddress(formDataArray, this.queryParams.id)

          .subscribe(
            (response: Address[]) => {
              this.addressService.notify('Address updated successfully');

              this.router.navigate(['/main/employee-info'], {
                queryParams: this.queryParams,
              });
            },

            (error: any) => {
              if (error.status == 400 || error.status == 404) {
                this.addressService.warn(error.error.message);
              }
            }
          );
      }
    }
  }

  getAllAddressById(id: number) {
    this.addressService.getAllAddressById(id).subscribe(
      (response: Address[]) => {
        forkJoin({
          permStates: this.addressService.getState(response[0].country),

          corresStates: this.addressService.getState(response[1].country),

          permCities: this.addressService.getCity(response[0].state),

          corresCities: this.addressService.getCity(response[1].state),
        }).subscribe((res) => {
          this.permStates = res.permStates;

          this.corrStates = res.corresStates;

          this.permCities = res.permCities;

          this.corresCities = res.corresCities;
        });

        this.permanentAddressForm.patchValue(response[0]);

        this.correspondenceAddressForm.patchValue(response[1]);

        this.corrId = response[1].id;
        debugger;
        this.actionLabel = 'Update';
      },

      (error) => {
        this.actionLabel = 'Save';
      }
    );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.permanentAddressForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.permanentAddressForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      const value = Object.values(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName, value);
    }

    return '';
  }

  isControlInvalidCorrespondenceAddress(controlName: string): boolean {
    const control = this.correspondenceAddressForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorMessageCorrespondenceAddress(controlName: string): string {
    const control = this.correspondenceAddressForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      const value = Object.values(control.errors)[0];
      return CustomValidators.getErrorMessage(errorKey, controlName, value);
    }

    return '';
  }
}
