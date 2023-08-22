import { Component } from '@angular/core';

import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',

  templateUrl: './sidebar.component.html',

  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isHide: boolean = false;

  sideBarList: any = [];

  masterList: any = [];

  selectedMenuName: string = '';

  constructor(private sidebarService: SidebarService) {
    this.populateSidebarMenu();

    this.sidebarService.toggle.subscribe((success: string) => {
      if (success && success.includes('toggled')) {
        this.isHide = true;

        this.sideBarList.forEach(
          (m: { showSubmenu: boolean }) => (m.showSubmenu = false)
        );
      } else {
        this.isHide = false;
      }
    });
  }

  sidebarTogle() {
    const $wrapper = document.querySelector('#wrapper')!;

    $wrapper.classList.toggle('toggled');

    this.sidebarService.toggle.next($wrapper.classList.toString());

    this.isHide = $wrapper.classList.contains('toggled');

    //console.log(this.isHide);
  }

  sidebarTogle1() {
    const $wrapper = document.querySelector('#wrapper')!;

    $wrapper.classList.toggle('toggled');

    this.sidebarService.toggle.next($wrapper.classList.toString());
  }

  protected onMenuWithSubmenuClick(menu: any): void {
    menu.showSubmenu = !menu.showSubmenu;

    if (this.isHide) {
      this.sidebarService.toggle.next('');
    }

    // if (menu.tableName) {

    //   this.datatableComponent.setTableName(menu.tableName);

    // }
  }

  protected onMenuWithSubmenuClick1(menu: any): void {
    menu.showSubmenu = !menu.showSubmenu;

    if (this.isHide) {
      this.sidebarService.toggle.next('');
    }
  }

  private populateSidebarMenu(): void {
    this.sideBarList = [
      {
        name: 'Dashboard',

        icon: 'fa-solid fa-house ps-1 sidebar-icon',

        showSubmenu: false,
      },

      {
        name: 'Master',

        icon: 'fa-solid fa-rocket ps-1 sidebar-icon',

        showSubmenu: false,

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

            onClick: () => {
              this.selectedMenuName = 'Employee Type';
            },
          },

          {
            name: 'Organization',

            icon: 'fa-solid fa-ellipsis',

            routerLink: ['/master/organization'],

            arrowMaster: false,
          },
        ],
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
