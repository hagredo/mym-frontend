import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { StageService } from 'src/app/services/stages/stage.service';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CityService } from 'src/app/services/cities/city.service';
import { SaveService } from 'src/app/services/saveproyect/save.service';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  public cityList : any;
  public clientList : any;
  public stagesList : any;
  public teamList : any;
  public deliverablesList : Array<any>;
  public projectForm: FormGroup;
  public stages: FormArray;
  public show : boolean = false;
  public iterador : number;
  public chekedMap : Map<number, boolean>;
  constructor(
    private clientsService : ClientsService, 
    private stageService : StageService,
    private teamsService : TeamsService,
    private cityServie : CityService,
    private saveService : SaveService,
    private deliverablesService : DeliverableService
  ) {
    this.deliverablesList = new Array<any>();
    this.chekedMap = new Map<number, boolean>();
    this.stages = new FormArray([]);
    this.projectForm = new FormGroup({
      city: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
      projectName: new FormControl('', Validators.required),
      team: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      stages: this.stages
    });
  }

  ngOnInit() {
    this.getAllClients();
    this.getAllCities();
    this.getAllStages();
    this.getAllTeams();
    this.getAllDeliverables();
  }

  createProject() {
    let body = this.buildProjectBody();
    this.saveService.saveProject(body).subscribe();
  }

  buildProjectBody():any {
    let stages = new Array();
    this.projectForm.get('stages').value.forEach(stage => {
      let stageProject = {
            idEtapa: stage.stageId,
            peso: stage.weight
          }
      stages.push(stageProject);
    });
    let body = {
      project: {
        estado: this.projectForm.get('status').value,
        idCiudad: this.projectForm.get('city').value,
        idCliente: this.projectForm.get('client').value,
        idEquipo: this.projectForm.get('team').value,
        nombre: this.projectForm.get('projectName').value
      },
      value: {
        idProyecto: 0,
        total: this.projectForm.get('value').value
      },
      stagesProject : stages
    }
    return body;
  }

  addStage(deliverableId:number, stage:number) {
    /*const stage = new FormGroup({
      stageId: new FormControl(stageId),
      weight: new FormControl(weight)
    });
    this.stages.push(stage);*/
    
  }

  getAllClients(){
    let clientDefault = {
      id: 0
    }
    this.clientList = new Array();
    this.clientList.push(clientDefault);
    this.clientsService.getAllClients().subscribe(
      response => {
        let resJson: any = response.json();
        this.clientList = resJson.clientList;
      },
      error => {
        console.log('Error al cargar lista de clientes');
      }
    );
  }

  getAllCities(){
    let cityDefault = {
      id: 0
    }
    this.cityList = new Array();
    this.cityList.push(cityDefault);
    this.cityServie.getAllCities().subscribe(
      response => {
        let resJson: any = response.json();
        this.cityList = resJson.cityList;
      },
      error => {
        console.log('Error al cargar lista de ciudades');
      }
    );
  }

  getAllStages(){
    let stageDefault = {
      id: 0
    }
    this.stagesList = new Array();
    this.stagesList.push(stageDefault);
    this.stageService.getAllStages().subscribe(
      response => {
        let resJson : any = response.json();
        this.stagesList = resJson.stagesList;
      },
      error => {
        console.log('Error al cargar lista de etapas');
      }
    );
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
      },
      error => {
        console.log('Error al cargar lista de equipos');
      }
    );
  }

  getAllDeliverables(){
    let DeliverablesDefault = {
      id: 0
    }
    this.teamList = new Array();
    this.teamList.push(DeliverablesDefault);
    this.deliverablesService.getAllDeliverables().subscribe(
      response => {
        let resJson : any = response.json();
        resJson.deliverableList.forEach(deliverable =>{
          let objectDeliverable = {
            id : deliverable.id,
            nombre : deliverable.nombre,
            checked : 'false'
          };
          this.deliverablesList.push(objectDeliverable);
        });
      },
      error => {
        console.log('Error al cargar lista de entregables');
      }
    );
  }

  showDeliverables(i : any){
    console.log(JSON.stringify(this.deliverablesList));
    if(i == this.iterador){
      this.iterador = -1;
    }else{
      this.iterador = i;
    }
  }

}