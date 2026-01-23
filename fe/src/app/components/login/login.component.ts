import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService } from 'src/app/services/token.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';
import { UserResponse } from 'src/app/responses/user/user.response';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string;
  password: string;
  showPassword: boolean = false;
  roles: Role[] = [];
  selectedRole: Role | undefined;
  rememberMe: boolean = true;
  userResponse?: UserResponse;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService
  ) {
    this.phoneNumber = '';
    this.password = '';
  }
  ngOnInit() {
    // this.roleService.getRoles().subscribe({
    //   next: (roles: Role[]) => {
    //     this.roles = roles;
    //     this.selectedRole = this.roles.length > 0 ? roles[0] : undefined;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching roles:', error);
    //   },
    // });
  }

  onPhoneChange() {
    console.log(`Phone number changed: ${this.phoneNumber}`);
  }
  login() {

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      // role_id: this.selectedRole ? this.selectedRole.id : 0,
    };
    debugger
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        alert('Login successful!');
        debugger;
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger;
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(
                this.userResponse
              );
              if (this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
                this.cartService.setUserCart(this.userResponse.id);

              }
            },
            complete: () => {},
            error: (error) => {},
          });
        }
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        debugger;
        alert(`Login failed: ${error?.error.message}`);
      },
    });
  }
}
