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

  constructor(
    private stageService : StageService,
    private deliverableService : DeliverableService,
    private modalService: NgbModal
  ) { 
    this.stageForm = new FormGroup({
      stageName: new FormControl('', Validators.required)
    });
    this.deliverableForm = new FormGroup({
      deliverableName: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  saveStage() {
    let body = {
      nombre: this.stageForm.get('stageName').value
    }
    this.stageService.saveStage(body).subscribe(
      response => {
        this.openModal('Guardar etapa', response.json().responseMessage);
        this.cleanForm();
      },
      error => {
        this.openModal('Guardar etapa', 'Error: ' + error.responseMessage);
      }
    );
  }

  saveDeliverable() {
    let body = {
      nombre: this.deliverableForm.get('deliverableName').value
    }
    this.deliverableService.saveDeliverable(body).subscribe(
      response => {
        this.openModal('Guardar entregable', response.json().responseMessage);
        this.cleanForm();
      },
      error => {
        this.openModal('Guardar entregable', 'Error: ' + error.responseMessage);
      }
    );
  }

  openModal(title:string, content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
  }

  cleanForm() {
    this.stageForm.get('stageName').setValue('');
    this.deliverableForm.get('deliverableName').setValue('');
  }
}
