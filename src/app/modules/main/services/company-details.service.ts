import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonMaster } from '../models/common-master.model';
import { CompanyDetails } from '../models/company-details.model';

@Injectable()
export class CompanyDetailsService {
  private dataSubject = new BehaviorSubject<string>('');
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getAllDefaultShift(): Observable<Array<CommonMaster>> {
    return this.http.get<Array<CommonMaster>>(
      'http://192.168.1.16:7000/employee/common-master/Default Shift?sort=priority,code'
    );
  }

  getAllProbations(): Observable<Array<CommonMaster>> {
    return this.http.get<Array<CommonMaster>>(
      'http://192.168.1.16:7000/employee/common-master/Probation?sort=priority,code'
    );
  }

  getAllBillables(): Observable<Array<CommonMaster>> {
    return this.http.get<Array<CommonMaster>>(
      'http://192.168.1.16:7000/employee/common-master/Billable?sort=priority,code'
    );
  }

  updateCompanyDetails(
    companyDetails: CompanyDetails,
    employeeId: number
  ): Observable<CompanyDetails> {
    return this.http.put<CompanyDetails>(
      'http://192.168.1.16:7000/employee/company-detail/update/' + employeeId,
      companyDetails
    );
  }
  notify(message: string) {
    this.toastrService.success(message);
  }

  warn(message: string) {
    this.toastrService.warning(message);
  }

  sendData(data: string) {
    this.dataSubject.next(data);
  }
  createComapanyDetails(companyDetails: CompanyDetails, id: number) {
    return this.http.post<CompanyDetails>(
      'http://192.168.1.16:7000/employee/company-detail/create/' + id,
      companyDetails
    );
  }

  searchCompanyDetailsById(Id: string): Observable<CompanyDetails> {
    return this.http.get<CompanyDetails>(
      'http://192.168.1.16:7000/employee/company-detail/' + Id
    );
  }

  // updateCompanyDetails(formData: any) {
  //   return this.http.put<Employees>(
  //     'http://192.168.1.16:7000/employee/update',
  //     Id
  //   );
  // }
}
