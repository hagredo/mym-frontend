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
  deliverableIds: Array<number>;

  @Output()
  deliverableSelection = new EventEmitter<number>();
  
  public deliverableForm: FormGroup;
  public deliverablesList : Array<any>;
  public deliverablesListSelected : Array<any>;
  selectedFiles: FileList;
  currentFileUpload: File;

  constructor(private deliverablesService : DeliverableService, private uploadService : UploadfileService, 
    private generateAlert : GenerateAlertService, private modalService: NgbModal) {
    
      if (!this.deliverableIds) {
      this.deliverableIds = new Array<number>(); 
    }
    this.deliverablesListSelected = new Array<any>();
    this.deliverableForm = new FormGroup({
      deliverableSelected : new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllDeliverables();
    if (this.deliverableIds)
      setTimeout(() => {
        this.deliverableIds.forEach(deliverableId => {
          this.addDeliverable(deliverableId);
        });
      }, 100);
  }

  onDeliverableSelection() {
    this.deliverableSelection.emit(this.deliverableForm.get('deliverableSelected').value);
  }

  addDeliverable(deliverableId? : number) {
    let deliverableSelected;
    this.deliverablesList.forEach(deliverable => {
      if (deliverable.id == ((deliverableId) ? deliverableId : this.deliverableForm.get('deliverableSelected').value)) {
        deliverableSelected = deliverable;
      }
    });
    if(!this.deliverablesListSelected.includes(deliverableSelected) && deliverableSelected) {
      this.deliverablesListSelected.push(deliverableSelected);
    } 
  }

  removeDeliverable(deliverableId:number) {
    for (let index = 0; index < this.deliverablesListSelected.length; index++) {
      const deliverable = this.deliverablesListSelected[index];
      if (deliverable.id == deliverableId) {
        this.deliverablesListSelected.splice(index, 1);
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

  selectFile(event) {
    this.selectedFiles = event.target.files;
    let body = {
      mensaje: 'El usuario hagredo ha cargado el documento para ',
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
