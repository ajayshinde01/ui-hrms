
import { Component, OnInit, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent  implements OnInit {
  queryParams: any;
  actionLabel: string;
  id: number;
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      console.log(this.queryParams.id + this.queryParams.actionLabel);
      // if (this.queryParams['actionLabel'] === 'Save') {
      console.log('employee main');
      // } else {
      //   this.actionLabel = 'Update';
      // }
    });
  }
  goBack() {
    this.router.navigate(['/main/employee-table']);
  }
}