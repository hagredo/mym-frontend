import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { StageService } from 'src/app/services/stages/stage.service';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CityService } from 'src/app/services/cities/city.service';
import { SaveService } from 'src/app/services/saveproyect/save.service';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { PaymentMethodService } from 'src/app/services/paymentmethod/payment-method.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';
import { ProjectService } from 'src/app/services/projects/project.service';
import { Router } from '@angular/router';

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
  public projectSelected: any;
  public isNotSelectedProject: boolean = true;

  public projectForm: FormGroup;
  public show : boolean = false;
  public iterador : number;
  public stagesListSelected : Array<any>;
  public stagesListSelectedMap : Map<number, string>;
  public stagesListToSend : Array<any>;
  public stagesIdList : Array<number>;
  public deliverablesMap : Map<number, Array<number>>;

  constructor(
    private router: Router,
    private clientsService : ClientsService, 
    private stageService : StageService,
    private teamsService : TeamsService,
    private cityServie : CityService,
    private saveService : SaveService,
    private projectService : ProjectService,
    private paymentMethodService : PaymentMethodService,
    private deliverableService : DeliverableService,
    private modalService: NgbModal
  ) {
    this.stagesListSelected = new Array<any>();
    this.stagesListToSend = new Array<any>();
    this.stagesIdList = new Array<number>();
    this.stagesListSelectedMap = new Map<number, string>();
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
    this.projectSelected = this.projectService.getProject();
    this.getAllClients();
    this.getAllCities();
    this.getAllStages();
    this.getAllTeams();
    this.getAllPaymentMethods(); 
    if (this.projectSelected && this.projectSelected.idCliente > 0) {
      this.isNotSelectedProject = false;
      this.fillForm();
    } else {
      this.isNotSelectedProject = true;
    }
  }

  fillForm() {
    this.projectForm.get('client').setValue(this.projectSelected.idCliente);
    this.projectForm.get('contractNumber').setValue(this.projectSelected.numeroContrato);
    this.projectForm.get('projectName').setValue(this.projectSelected.nombre);
    this.projectForm.get('city').setValue(this.projectSelected.idCiudad);
    this.projectForm.get('team').setValue(this.projectSelected.idEquipo);
    if (this.projectSelected.estado === 'CREADO') {
      this.projectSelected.estado = 'C'
    }
    if (this.projectSelected.estado === 'EN EJECUCIÓN') {
      this.projectSelected.estado = 'E'
    }
    if (this.projectSelected.estado === 'FINALIZADO') {
      this.projectSelected.estado = 'F'
    }
    this.projectForm.get('status').setValue(this.projectSelected.estado);
    this.projectService.getValueByProject(this.projectSelected.id).subscribe(response => {
      let valor = response.json().valor;
      this.projectForm.get('value').setValue(valor.total);
    });
    this.projectForm.get('paymentMethod').setValue(this.projectSelected.idFormaPago);
    this.projectForm.get('initExecution').setValue(this.transformDate(this.projectSelected.inicioEjecucion));
    this.projectForm.get('endExecution').setValue(this.transformDate(this.projectSelected.finEjecucion));
    this.projectForm.get('initExtension').setValue(this.transformDate(this.projectSelected.inicioProrroga));
    this.projectForm.get('endExtension').setValue(this.transformDate(this.projectSelected.finProrroga));
    this.projectForm.get('initSuspension').setValue(this.transformDate(this.projectSelected.inicioSuspension));
    this.projectForm.get('endSuspension').setValue(this.transformDate(this.projectSelected.finSuspension));
    this.projectForm.get('stageSelected').setValue(0);
    this.stageService.getStagesByProject(this.projectSelected.id).subscribe(response => {
      let stagesProject = response.json().stagesProjectList;
      stagesProject.forEach(stage => {
        let stageSelected = {
          id: stage.id.idEtapa,
          nombre: this.stagesListSelectedMap.get(stage.id.idEtapa),
          peso: stage.id.peso
        }
        this.stagesListSelected.push(stageSelected);
        this.onWeigthChange(stageSelected.id, stageSelected.peso);
        this.stagesIdList.push(stageSelected.id);
      });
    });
    this.deliverableService.getDeliverablesByProject(this.projectSelected.id).subscribe(response => {
      let deliverablesProject = response.json().deliverableStageList;
      deliverablesProject.forEach(deliberableStage => {
        this.processDeliverableSelection(deliberableStage.id.idEntregable, deliberableStage.id.idEtapa);
      });
    });
  }

  transformDate(dateArray:Array<any>):string {
    let year = dateArray[0];
    let month = (parseInt(dateArray[1]) > 9) ? dateArray[1] : ('0' + dateArray[1]);
    let day = (parseInt(dateArray[2]) > 9) ? dateArray[2] : ('0' + dateArray[2]);
    return year + '-' + month + '-' + day;
  }

  saveProject() {
    let body = this.buildProjectBody();
    if (this.projectSelected && this.projectSelected.id > 0) {
      body.project.id = this.projectSelected.id;
    }
    this.saveService.saveProject(body).subscribe(
      response => {
        this.openModal(response.json().responseMessage);
        this.cleanForm();
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
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
        idProyecto: (this.projectSelected && this.projectSelected.idCliente > 0) ? this.projectSelected.id : 0,
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

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar proyecto';
    modalRef.componentInstance.content = content;
  }

  cleanForm() {
    this.projectForm.get('client').setValue(0);
    this.projectForm.get('contractNumber').setValue('');
    this.projectForm.get('projectName').setValue('');
    this.projectForm.get('city').setValue(0);
    this.projectForm.get('team').setValue(0);
    this.projectForm.get('status').setValue(0);
    this.projectForm.get('value').setValue('');
    this.projectForm.get('paymentMethod').setValue(0);
    this.projectForm.get('initExecution').setValue('');
    this.projectForm.get('endExecution').setValue('');
    this.projectForm.get('initExtension').setValue('');
    this.projectForm.get('endExtension').setValue('');
    this.projectForm.get('initSuspension').setValue('');
    this.projectForm.get('endSuspension').setValue('');
    this.projectForm.get('stageSelected').setValue(0);
    this.stagesListSelected = new Array<any>();
    this.stagesListToSend = new Array<any>();
    this.stagesIdList = new Array<number>();
    this.deliverablesMap = new Map<number, Array<number>>();
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

  removeStage(stagId:number) {
    for (let index = 0; index < this.stagesListSelected.length; index++) {
      const stage = this.stagesListSelected[index];
      if (stage.id == stagId) {
        this.stagesListSelected.splice(index, 1);
      }
    }
    this.deliverablesMap.delete(stagId);
  }

  onWeigthChange(stageId:number, weigth:number) {
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
        this.stagesList.forEach(stage => {
          stage.peso = 0;
          this.stagesListSelectedMap.set(stage.id, stage.nombre);
        });
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
