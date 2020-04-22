import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadfileService } from 'src/app/services/uploadfiles/uploadfile.service';
import { GenerateAlertService } from 'src/app/services/generateAlerts/generate-alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';


@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss']
})
export class DeliverablesComponent implements OnInit {

  @Input() 
  deliverables: Array<any>;

  @Output()
  deliverableSelection = new EventEmitter<any>();
  
  public deliverableForm: FormGroup;
  public deliverablesList : Array<any>;
  public deliverablesListSelected : Array<any>;
  public idsListSelected: Array<number>;
  selectedFiles: FileList;
  currentFileUpload: File;

  constructor(
    private deliverablesService : DeliverableService, 
    private uploadService : UploadfileService, 
    private generateAlert : GenerateAlertService, 
    private modalService: NgbModal
  ) {
    if (!this.deliverables) {
      this.deliverables = new Array<any>(); 
    }
    this.deliverablesListSelected = new Array<any>();
    this.idsListSelected = new Array<any>();
    this.deliverableForm = new FormGroup({
      deliverableSelected : new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllDeliverables();
    if (this.deliverables)
      setTimeout(() => {
        this.deliverables.forEach(deliverable => {
          this.addDeliverable(deliverable);
        });
      }, 100);
  }

  addDeliverable(deliverable? : any) {
    let deliverableSelected = {
      id: (deliverable) ? deliverable.id : parseInt(this.deliverableForm.get('deliverableSelected').value),
      nombre: '',
      peso: (deliverable) ? deliverable.weigth : 0
    };
    this.deliverablesList.forEach(deliverableTemp => {
      if (deliverableTemp.id == ((deliverable) ? deliverable.id : 
          parseInt(this.deliverableForm.get('deliverableSelected').value))) {
        deliverableSelected.nombre = deliverableTemp.nombre;
      }
    });
    if(!this.idsListSelected.includes(deliverableSelected.id) && deliverableSelected.id > 0) {
      this.deliverablesListSelected.push(deliverableSelected);
      this.idsListSelected.push(deliverableSelected.id);
      this.deliverableSelection.emit(deliverable);
    } 
  }

  onWeigthChange(deliverableId: number, weigth: number) {
    let deliverable = {
      id: deliverableId,
      weigth: weigth
    }
    this.deliverableSelection.emit(deliverable);
  }

  removeDeliverable(deliverableId:number) {
    for (let index = 0; index < this.deliverablesListSelected.length; index++) {
      const deliverable = this.deliverablesListSelected[index];
      if (deliverable.id == deliverableId) {
        this.deliverablesListSelected.splice(index, 1);
        this.idsListSelected.splice(index, 1);
      }
    }
  }

  getAllDeliverables(){
    let deliverableDefault = {
      id: 0
    }
    this.deliverablesList = new Array();
    this.deliverablesList.push(deliverableDefault);
    this.deliverablesService.getAllDeliverables().subscribe(
      response => {
        let resJson: any = response.json();
        this.deliverablesList = resJson.deliverableList;
      },
      error => {
        console.log('Error al cargar lista de entregables');
      }
    );
  }

  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      alert('File Successfully Uploaded');
      this.selectedFiles = undefined;
    });
  }

  selectFile(event, nombre:string) {
    this.selectedFiles = event.target.files;
    let body = {
      mensaje: 'El usuario hagredo ha cargado el documento para '+ nombre,
      timestampAlerta: new Date,
      idConfig: 1
    }
    this.generateAlert.generateAlert(body).subscribe(event =>{
      this.openModal(event.json().responseMessage);
    });
  }
  
  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar cliente';
    modalRef.componentInstance.content = content;
  }

}
