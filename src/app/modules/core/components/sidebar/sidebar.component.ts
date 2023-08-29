import { Component, OnInit } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sidebar',

  templateUrl: './sidebar.component.html',

  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isHide: boolean = false;

  sideBarList: any = [];

  masterList: any = [];

  isFooter: boolean = true;

  selectedMenuName: string = '';

  queryParams?: Params;

  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute
  ) {
    //this.populateSidebarMenuForUser();

    //this.populateSidebarMenuForAdmin();

    this.sidebarService.toggle.subscribe((success: string) => {
      if (success && success.includes('toggled')) {
        this.isHide = true;
        this.isFooter = false;

        this.sideBarList.forEach(
          (m: { showSubmenu: boolean }) => (m.showSubmenu = false)
        );
      } else {
        this.isHide = false;
        this.isFooter = true;
      }
    });
  }
  ngOnInit(): void {
    if (sessionStorage.getItem('userRole') == 'user') {
      console.log('user');
      this.populateSidebarMenuForUser();
    } else if (sessionStorage.getItem('userRole') == 'admin') {
      console.log('admin');
      this.populateSidebarMenuForAdmin();
    }
  }

  sidebarTogle() {
    const $wrapper = document.querySelector('#wrapper')!;

    $wrapper.classList.toggle('toggled');

    this.sidebarService.toggle.next($wrapper.classList.toString());

    this.isHide = $wrapper.classList.contains('toggled');
  }

  sidebarTogle1() {
    const $wrapper = document.querySelector('#wrapper')!;

    $wrapper.classList.toggle('toggled');

    this.sidebarService.toggle.next($wrapper.classList.toString());

    this.isFooter = true;
  }

  protected onMenuWithSubmenuClick(menu: any): void {
    menu.showSubmenu = !menu.showSubmenu;

    if (this.isHide) {
      this.sidebarService.toggle.next('');
    }
  }

  protected onMenuWithSubmenuClick1(menu: any): void {
    if (this.isHide) {
      this.sidebarService.toggle.next('');
    }
  }

  private populateSidebarMenuForUser(): void {
    this.sideBarList = [
      {
        name: 'Dashboard',

        icon: 'fa-solid fa-house ps-1 sidebar-icon',

        showSubmenu: true,
      },

      {
        name: 'Master',

        icon: 'fa-solid fa-rocket ps-1 sidebar-icon',

        showSubmenu: true,

        submenu: [
          {
            name: 'Grade',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/grade'],

            arrowMaster: false,
          },

          {
            name: 'Role',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/role'],

            arrowMaster: false,
          },

          {
            name: 'Designation',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/designation'],

            arrowMaster: false,
          },

          {
            name: 'Department',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/department-table'],

            arrowMaster: false,
          },

          {
            name: 'Organization',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/organization'],

            arrowMaster: false,
          },
          {
            name: 'Division',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/master/division-table'],
            arrowMaster: false,
          },
          {
            name: 'Employee Type',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/master/employee-table'],
            arrowMaster: false,
          },
        ],
      },
      {
        name: 'Employee',
        icon: 'fa-solid fa-rocket ps-1 sidebar-icon',
        showSubmenu: false,
        submenu: [
          {
            name: 'employee-master',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/main/employee-table'],
            arrowMaster: false,
          },
        ],
      },
    ];
  }

  private populateSidebarMenuForAdmin(): void {
    this.sideBarList = [
      {
        name: 'Dashboard',

        icon: 'fa-solid fa-house ps-1 sidebar-icon',

        showSubmenu: true,
      },

      {
        name: 'Common Master',

        icon: 'fa-solid fa-rocket ps-1 sidebar-icon',
        routerLink: ['/common-master/parent'],

        showSubmenu: true,
      },
      {
        name: 'User Management',
        icon: 'fa-solid fa-lock ps-1 sidebar-icon',
        showSubmenu: true,
        submenu: [
          {
            name: 'User',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/user/user-table'],
            arrowMaster: false,
          },
          {
            name: 'Role',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/user/user-role-table'],
            arrowMaster: false,
          },
          {
            name: 'Scope',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/user/scope-table'],
            arrowMaster: false,
          },
        ],
      },
  //          {
  //       name: 'Email',

  //       icon: 'fa-solid fa-envelope ps-1 sidebar-icon',

  //       showSubmenu: true,
  //       submenu:[
     
  //         {
  //           name: 'Email',
  //           icon: 'fa-solid fa-ellipsis',
  //           routerLink: ['/master/emailtable'],
  //           arrowMaster: false,
  //         },
  // ]
  //     },
      {
        name: 'Email Template',

        icon: 'fa-solid fa-envelope ps-1 sidebar-icon',

        showSubmenu: true,
        submenu:[
     
          {
            name: 'Email Template',
            icon: 'fa-solid fa-ellipsis',
            routerLink: ['/master/emailtemplatetable'],
            arrowMaster: false,
          },
  ]
      },
   
    ];
  }

  toggleResult(i: any) {
    this.sideBarList[i].arrow = !this.sideBarList[i].arrow;
  }

  toggleResult1(i: any) {
    this.masterList[i].arrowMaster = !this.masterList[i].arrowMaster;
  }

  // FIXME: Bad code ported from header.component.ts.

  protected collapseSideBar(): void {
    const $wrapper = document.querySelector('#wrapper')!;

    //   $wrapper.classList.add('toggled');

    this.sidebarService.toggle.next($wrapper.classList.toString());
  }

  // protected collapseSideBar1(): void {

  //   const $wrapper = document.querySelector('#wrapper')!;

  //   // $wrapper.classList.add('toggled');

  //   this.sidebarService.toggle.next($wrapper.classList.toString());

  // }

  // selectedMenuItem: string = 'Employee Type';

  // setSelectedMenuItem(itemName: string) {

  //   this.selectedMenuItem = itemName;

  // }
}
