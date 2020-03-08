import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { StageService } from 'src/app/services/stages/stage.service';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CityService } from 'src/app/services/cities/city.service';
import { SaveService } from 'src/app/services/saveproyect/save.service';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { PaymentMethodService } from 'src/app/services/paymentmethod/payment-method.service';

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
  public paymentMethodList: any;

  public projectForm: FormGroup;
  public show : boolean = false;
  public iterador : number;
  public stagesListSelected : Array<any>;
  public stagesListToSend : Array<any>;
  public stagesIdList : Array<number>;
  public deliverablesMap : Map<number, Array<number>>;

  constructor(
    private clientsService : ClientsService, 
    private stageService : StageService,
    private teamsService : TeamsService,
    private cityServie : CityService,
    private saveService : SaveService,
    private paymentMethodService : PaymentMethodService
  ) {
    this.stagesListSelected = new Array<any>();
    this.stagesListToSend = new Array<any>();
    this.stagesIdList = new Array<number>();
    this.deliverablesMap = new Map<number, Array<number>>();
    this.projectForm = new FormGroup({
      city: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
      contractNumber: new FormControl('', Validators.required),
      projectName: new FormControl('', Validators.required),
      team: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      initExecution: new FormControl('', Validators.required),
      endExecution: new FormControl('', Validators.required),
      initExtension: new FormControl({value: '', disabled: true}, Validators.required),
      endExtension: new FormControl('', Validators.required),
      initSuspension: new FormControl({value: '', disabled: true}, Validators.required),
      endSuspension: new FormControl('', Validators.required),
      stageSelected: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllClients();
    this.getAllCities();
    this.getAllStages();
    this.getAllTeams();
    this.getAllPaymentMethods();
  }

  createProject() {
    let body = this.buildProjectBody();
    console.log(JSON.stringify(body));
    this.saveService.saveProject(body).subscribe();
  }

  buildProjectBody():any {
    let body = {
      project: {
        numeroContrato: this.projectForm.get('contractNumber').value,
        nombre: this.projectForm.get('projectName').value,
        estado: this.projectForm.get('status').value,
        idCliente: this.projectForm.get('client').value,
        idCiudad: this.projectForm.get('city').value,
        idEquipo: this.projectForm.get('team').value,
        idFormaPago: this.projectForm.get('paymentMethod').value,
        inicioEjecucion: this.projectForm.get('initExecution').value,
        finEjecucion: this.projectForm.get('endExecution').value,
        inicioProrroga: this.projectForm.get('initExtension').value,
        finProrroga: this.projectForm.get('endExtension').value,
        inicioSuspension: this.projectForm.get('initSuspension').value,
        finSuspension: this.projectForm.get('endSuspension').value,
        status: 'A',
      },
      value: {
        idProyecto: 0,
        total: this.projectForm.get('value').value
      },
      stageProjectList : this.stagesListToSend,
      deliverableStageList : this.buildDeliverableStageList()
    }
    return body;
  }

  buildDeliverableStageList(): Array<any> {
    let deliverableStageList = new Array<any>();
    this.deliverablesMap.forEach((deliverableArray: Array<any>, stageId: number) => {
      deliverableArray.forEach(deliverable => {
        let deliverableObject = {
          idEtapa: stageId,
          idEntregable: deliverable
        }
        deliverableStageList.push(deliverableObject);
      });
    });
    return deliverableStageList;
  }

  changeInitDate(init:string, end:string) {
    this.projectForm.get(init).setValue(this.projectForm.get(end).value);
  }

  addStage() {
    let stageSelected;
    this.stagesList.forEach(stage => {
      if (stage.id == this.projectForm.get('stageSelected').value)
      stageSelected = stage;
    });
    if(!this.stagesListSelected.includes(stageSelected) && stageSelected) {
      this.stagesListSelected.push(stageSelected);
    }
  }

  onWeigthChange(stageId:number, weigth:number) {
    this.stagesListToSend
    let stageProject = {
      idEtapa: stageId,
      peso: weigth
    }
    if(!this.stagesIdList.includes(stageId)) {
      this.stagesIdList.push(stageId);
      this.stagesListToSend.push(stageProject);
    } else {
      for (let index = 0; index < this.stagesListToSend.length; index++) {
        const stage = this.stagesListToSend[index];
        if (stage.idEtapa == stageId) {
          this.stagesListToSend[index] = stageProject;
        }
      }
    }
  }

  showDeliverables(i : any){
    if(i == this.iterador){
      this.iterador = -1;
    }else{
      this.iterador = i;
    }
  }

  getDeliverablesByStage(stageId : number): Array<number> {
    return this.deliverablesMap.get(stageId);
  }

  processDeliverableSelection(deliberableId : number, stageId : number) {
    let deliverableArray = this.deliverablesMap.get(stageId);
    if (deliverableArray) {
      if (!deliverableArray.includes(deliberableId) && deliberableId) {
        deliverableArray.push(deliberableId);
      }
    } else if(deliberableId) {
      deliverableArray = new Array<number>();
      deliverableArray.push(deliberableId);
    }
    this.deliverablesMap.set(stageId, deliverableArray);
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

  getAllPaymentMethods(){
    let paymentMethodDefault = {
      id: 0
    }
    this.paymentMethodList = new Array();
    this.paymentMethodList.push(paymentMethodDefault);
    this.paymentMethodService.getAllPaymentMethods().subscribe(
      response => {
        let resJson : any = response.json();
        this.paymentMethodList = resJson.paymentMethodList;;
      },
      error => {
        console.log('Error al cargar lista de formas de pago');
      }
    );
  }

}
