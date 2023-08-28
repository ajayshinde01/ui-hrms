import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private router: Router) {}

  ngOnInit() {}

  sidebarTogle() {
    const $wrapper = document.querySelector('#wrapper')!;
    $wrapper.classList.toggle('toggled');
    this.sidebarService.toggle.next($wrapper.classList.toString());
  }

  onLogout() {
    this.router.navigate(['/']);
  }
}
