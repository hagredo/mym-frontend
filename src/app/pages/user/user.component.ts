import { Component, OnInit } from "@angular/core";
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  providers: [NgbModal]
})
export class UserComponent implements OnInit {

  public userForm: FormGroup;
  public userRole: number;
  
  constructor(
    private userService: UserService, 
    private authService: AuthGuardService,
    private modalService: NgbModal,
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
        if (resJson.user && resJson.user.idRol > 0) {
          this.authService.setToken(resJson.user.token);
          this.authService.userRole = resJson.user.idRol;
          this.router.navigate(['/dashboard']);
        } else {
          this.openModal('Credenciales invalidas')
        }
      },
      error => {
        this.openModal('Error de logueo: ' + error.responseMessage)
      }
    );
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Login';
    modalRef.componentInstance.content = content;
  }

}
