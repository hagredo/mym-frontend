import { Component, OnInit } from "@angular/core";
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {

  public userForm: FormGroup;
  public userRole: number;
  
  constructor(
    private userService: UserService, 
    private authService: AuthGuardService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      company: new FormControl({value: 'Grupo M&M Consultoria S.A.S.', disabled: true}, Validators.required)
    });
  }

  ngOnInit() {}
  
  validateUser() {
    let userName = this.userForm.get('userName').value;
    let passwd = this.userForm.get('password').value;
    this.userService.validUser(userName, passwd).subscribe(
      response => {
        let resJson: any = response.json();
        this.authService.setToken(resJson.user.token);
        this.authService.userRole = resJson.user.idRol;
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log('Credenciales invalidas');
      }
    );
  }

}
