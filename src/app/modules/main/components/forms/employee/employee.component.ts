import { Component, HostListener, OnInit, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  queryParams: any;
  actionLabel: string;
  id: number;
  emp_id: number = 0;

  cardDivHeight: any = '';

  cardHeights!: number;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      this.emp_id = this.queryParams.id;
      console.log(this.queryParams.id + this.queryParams.actionLabel);
      // if (this.queryParams['actionLabel'] === 'Save') {
      console.log('employee main');
      // } else {
      //   this.actionLabel = 'Update';
      // }
    });
    this.cardHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.cardHeight();
  }

  cardHeight() {
    this.cardHeights = window.innerHeight;

    this.cardDivHeight = this.cardHeights - 110;
  }

  goBack() {
    this.router.navigate(['/main/employee-table']);
  }
}
