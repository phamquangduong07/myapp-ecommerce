import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  phone: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth!: Date;
  showPassword: boolean = false;
  showRetype: boolean = false;
  constructor(private router: Router, private userService: UserService) {
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneChange() {
    console.log(`Phone number changed: ${this.phone}`);
  }
  register() {
    const message =
      `phone: ${this.phone}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `fullName: ${this.fullName}` +
      `address: ${this.address}` +
      `isAccepted: ${this.isAccepted}` +
      `dateOfBirth: ${this.dateOfBirth}`;

    const registerDto:RegisterDTO = {
      fullname: this.fullName,
      phone_number: this.phone,
      address: this.address,
      password: this.password,
      retype_password: this.retypePassword,
      date_of_birth: this.dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 1,
      isAccepted: this.isAccepted
    };
    this.userService.register(registerDto).subscribe({
      next: (response: any) => {
        debugger;

        this.router.navigate(['/login']);
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        alert(`Registration failed: ${error.error.message}`);
        debugger;
        console.error('Registration failed:', error);
      },
    });
  }

  dateOfBirthChange() {}

  checkPasswordMatch() {
    if (!this.password || !this.retypePassword) {
      this.registerForm.controls['retypePassword'].setErrors(null);
      return;
    }
    if (this.password !== this.retypePassword) {
      this.registerForm.controls['retypePassword'].setErrors({
        passwordMismatch: true,
      });
    } else {
      this.registerForm.controls['retypePassword'].setErrors(null);
    }
  }
  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        this.registerForm.controls['dateOfBirth'].setErrors({
          invalidAge: true,
        });
      } else {
        this.registerForm.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
