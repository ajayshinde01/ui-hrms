import { Employees } from './employee.model';

export interface EmergencyContacts {
  id: number;
  emergencyContactName: string;
  emergencyContactNumber: string;
  relation: string;
  employee: Employees;
  orgCode: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
