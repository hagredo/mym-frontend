import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  public teamForm: FormGroup;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public teamList: Array<any>;
  public userList: Array<any>;
  public userListSelected: Array<any>;
  public teamSelected: any;
  public userSelected: any;
  public userLeader: any;
  public isNewTeam: boolean;

  constructor(
    private teamsService : TeamsService,
    private userService : UserService,
    private modalService: NgbModal
  ) {
    this.userListSelected = new Array<any>();
    this.teamSelected = {};
    this.userSelected = {};
    this.userLeader = {};
    this.isNewTeam = true;
    this.teamForm = new FormGroup({
      teamName: new FormControl('', Validators.required),
      userSelected: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllTeams();
    this.getAllUsers();
  }

  saveTeam() {
    let body = this.buildTeamBody();
    if (!this.isNewTeam && this.teamSelected && this.teamSelected.id > 0) {
      body.team.id = this.teamSelected.id;
    }
    this.teamsService.saveTeamt(body).subscribe(
      response => {
        this.openModal(response.json().responseMessage);
        this.cleanForm();
        this.getAllTeams();
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
  }

  buildTeamBody(): any {
    let body = {
      team: {
        nombre: this.teamForm.get('teamName').value
      },
      userTeamList : this.buildDeliverableStageList()
    }
    return body;
  }

  buildDeliverableStageList(): Array<any> {
    let usersByTeamList = new Array<any>();
    this.userListSelected.forEach(user => {
      let userObject = {
        userId: user.id,
        isLeader: false,
      }
      if (user.id === this.userLeader.id) {
        userObject.isLeader = true;
      }
      usersByTeamList.push(userObject);
    });
    return usersByTeamList;
  }

  editTeam() {
    this.isNewTeam = false;
    this.teamForm.get('teamName').setValue(this.teamSelected.nombre);
    this.teamForm.get('userSelected').setValue(0);
    this.userService.getUsersByTeam(this.teamSelected.id).subscribe(response => {
      this.userListSelected = response.json().userList;
      this.userListSelected.forEach(user => {
        if (user.isLeader) {
          this.userLeader = user;
        }
      });
    });
  }

  selectTeam(teamId:number) {
    this.cleanForm();
    this.clicked1 = false;
    this.clicked2 = false;
    this.teamList.forEach(team => {
      if (team.id == teamId)
        this.teamSelected = team;
    });
  }

  selectLeader(userId:number) {
    this.userList.forEach(user => {
      if (user.id == userId)
        this.userLeader = user;
    });
  }

  addUser() {
    let userSelected;
    this.userList.forEach(user => {
      if (user.id == this.teamForm.get('userSelected').value)
        userSelected = user;
    });
    if(!this.userListSelected.includes(userSelected) && userSelected) {
      this.userListSelected.push(userSelected);
    }
  }

  cleanForm() {
    this.teamForm.get('teamName').setValue('');
    this.teamForm.get('userSelected').setValue(0);
    this.userListSelected = new Array<any>();
    this.userSelected = {};
    this.userLeader = {};
    this.clicked1 = false;
    this.clicked2 = false;
    this.isNewTeam = true;
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar proyecto';
    modalRef.componentInstance.content = content;
  }

  getAllTeams(){
    let teamDefault = {
      id: 0
    }
    this.teamList = new Array();
    this.teamList.push(teamDefault);
    this.teamsService.getAllTeams().subscribe(
      response => {
        let resJson : any = response.json();
        this.teamList = resJson.teamList;
        this.teamSelected = this.teamList[0];
      },
      error => {
        this.openModal('Error: ' + 'Error al cargar lista de equipos');
      }
    );
  }

  getAllUsers(){
    let userDefault = {
      id: 0
    }
    this.userList = new Array();
    this.userList.push(userDefault);
    this.userService.getAllUsers().subscribe(
      response => {
        let resJson : any = response.json();
        this.userList = resJson.userList;
      },
      error => {
        this.openModal('Error: ' + 'Error al cargar lista de integrantes');
      }
    );
  }

}
