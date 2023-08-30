import { Employees } from './employee.model';

export interface Address {
  id: number;
  addressType: string;
  address1: string;
  address2: string;
  landmark: string;
  tenureYear: number;
  tenureMonth: number;
  city: string;
  state: string;
  country: string;
  postcode: string;
  ownershipStatus: string;
  employee: Employees;
  orgCode: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
