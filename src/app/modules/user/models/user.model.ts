export interface User {
  id: string;
  email: String;
  password: String;
  firstName: String;
  lastName: String;
  statusCode: Number;
  status: String;
  roles: String[];
  enabled: boolean;
}
