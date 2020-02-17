import { Component, OnInit } from "@angular/core";
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {

  public userForm: FormGroup;
  
  constructor(private userService: UserService, private authService: AuthGuardService) {
    this.userForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      company: new FormControl({value: 'M&M Consulting', disabled: true}, Validators.required)
    });
  }

  ngOnInit() {}
  
  validateUser() {
    let userName = this.userForm.get('userName').value;
    let passwd = this.userForm.get('password').value;
    this.userService.validUser(userName, passwd).subscribe(response => {
      let resJson: any = response.json();
      this.authService.setToken(resJson.responseMessage);
    });
  }

}
