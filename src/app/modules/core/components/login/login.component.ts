import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginResponse } from '../../model/loginResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],

      password: ['', [Validators.required]],
    });
  }

  onSumbit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      // this.router.navigate(['/master/grade']);
      this.loginService.authenticate(formData).subscribe(
        (response: Array<LoginResponse>) => {
          // Need to store jwt token in session storage and route it to the landing page.
          // localStorage.setItem('token', response.jwtToken);
          this.router.navigate(['/master/dashboard']);
        },
        (error: any) => {
          console.error('Authentication failed', error);
        }
      );
    }
  }
}
