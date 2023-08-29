import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { CommonMaster } from '../../../models/common-master.model';
import { Employees } from '../../../models/employee.model';
import { Address } from '../../../models/address.model';
import { AddressService } from '../../../services/address.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent {}
