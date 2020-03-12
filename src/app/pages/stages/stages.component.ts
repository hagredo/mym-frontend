import { Component, OnInit } from '@angular/core';
import { StageService } from 'src/app/services/stages/stage.service';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {

  public stageForm: FormGroup;
  public deliverableForm: FormGroup;
  public clickedStage1: boolean = false;
  public clickedStage2: boolean = false;
  public stageList : any;
  public stageSelected: any;
  public clickedDeliverable1: boolean = false;
  public clickedDeliverable2: boolean = false;
  public deliverableList : any;
  public deliverableSelected: any;
  public isNewStage: boolean;
  public isNewDelivarable: boolean;

  constructor(
    private stageService : StageService,
    private deliverableService : DeliverableService,
    private modalService: NgbModal
  ) {
    this.stageSelected = {};
    this.deliverableSelected = {};
    this.isNewStage = true;
    this.isNewDelivarable = true;
    this.stageForm = new FormGroup({
      stageName: new FormControl('', Validators.required)
    });
    this.deliverableForm = new FormGroup({
      deliverableName: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllStages();
    this.getAllDeliverables();
  }

  saveStage() {
    let body = this.buildStageBody();
    if (!this.isNewStage && this.stageSelected && this.stageSelected.id > 0) {
      body.id = this.stageSelected.id
    }
    this.stageService.saveStage(body).subscribe(
      response => {
        this.openModal('Guardar etapa', response.json().responseMessage);
        this.cleanStageForm();
        this.cleanDeliverableForm();
        this.getAllStages();
      },
      error => {
        this.openModal('Guardar etapa', 'Error: ' + error.responseMessage);
      }
    );
  }

  saveDeliverable() {
    let body = this.buildDeliverableBody();
    if (!this.isNewDelivarable && this.deliverableSelected && this.deliverableSelected.id > 0) {
      body.id = this.deliverableSelected.id
    }
    this.deliverableService.saveDeliverable(body).subscribe(
      response => {
        this.openModal('Guardar entregable', response.json().responseMessage);
        this.cleanStageForm();
        this.cleanDeliverableForm();
        this.getAllDeliverables();
      },
      error => {
        this.openModal('Guardar entregable', 'Error: ' + error.responseMessage);
      }
    );
  }

  buildStageBody():any {
    let body = {
      nombre: this.stageForm.get('stageName').value
    }
    return body;
  }

  buildDeliverableBody():any {
    let body = {
      nombre: this.deliverableForm.get('deliverableName').value
    }
    return body;
  }

  editStage() {
    this.isNewStage = false;
    this.stageForm.get('stageName').setValue(this.stageSelected.nombre);
  }

  editDeliverable() {
    this.isNewDelivarable = false;
    this.deliverableForm.get('deliverableName').setValue(this.deliverableSelected.nombre);
  }

  selectStage(stageId:number) {
    this.cleanStageForm();
    this.clickedStage1 = false;
    this.clickedStage2 = false;
    this.stageList.forEach(stage => {
      if (stage.id == stageId)
        this.stageSelected = stage;
    });
  }

  selectDeliverable(deliverableId:number) {
    this.cleanDeliverableForm();
    this.clickedDeliverable1 = false;
    this.clickedDeliverable1 = false;
    this.deliverableList.forEach(deliverable => {
      if (deliverable.id == deliverableId)
        this.deliverableSelected = deliverable;
    });
  }

  openModal(title:string, content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
  }

  cleanStageForm() {
    if (this.stageForm.get('stageName').value) {
      this.stageForm.get('stageName').setValue('');
    }
    this.clickedStage1 = false;
    this.clickedStage2 = false;
    this.isNewStage = true;
  }
  
  cleanDeliverableForm() {
    if (this.deliverableForm.get('deliverableName').value) {
      this.deliverableForm.get('deliverableName').setValue('');
    }
    this.clickedDeliverable1 = false;
    this.clickedDeliverable1 = false;
    this.isNewDelivarable = true;
  }
  
  getAllStages(){
    let stageDefault = {
      id: 0
    }
    this.stageList = new Array();
    this.stageList.push(stageDefault);
    this.stageService.getAllStages().subscribe(
      response => {
        let resJson: any = response.json();
        this.stageList = resJson.stagesList;
        this.stageSelected = this.stageList[0];
      },
      error => {
        console.log('Error al cargar lista de etapas');
      }
    );
  }

  getAllDeliverables(){
    let deliverableDefault = {
      id: 0
    }
    this.deliverableList = new Array();
    this.deliverableList.push(deliverableDefault);
    this.deliverableService.getAllDeliverables().subscribe(
      response => {
        let resJson: any = response.json();
        this.deliverableList = resJson.deliverableList;
        this.deliverableSelected = this.deliverableList[0];
      },
      error => {
        console.log('Error al cargar lista de entregables');
      }
    );
  }

}
