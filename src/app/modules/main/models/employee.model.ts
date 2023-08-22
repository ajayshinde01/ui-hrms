import { Division } from '../../master/models/division.model';

export interface Employee {
  id: number;
  employeeCode: String;
  profileImage: String;
  firstName: String;
  middleName: String;
  lastName: String;
  dateOfBirth: String;
  gender: String;
  dateOfJoining: String;
  age: String;
  status: String;
  division: Division;
  userId: String;
  mobile: String;
  email: String;
  orgCode: String;
  createdBy: String;
  updatedBy: String;
}
