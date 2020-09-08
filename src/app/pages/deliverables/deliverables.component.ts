import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadfileService } from 'src/app/services/uploadfiles/uploadfile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss']
})
export class DeliverablesComponent implements OnInit {

  @Input() 
  projectId: number;
  @Input() 
  stageId: number;
  @Input() 
  deliverables: Array<any>;

  @Output()
  deliverableSelection = new EventEmitter<any>();
  @Output()
  deleteDeliverable = new EventEmitter<any>();
  
  public deliverableForm: FormGroup;
  public deliverablesList : Array<any>;
  public deliverablesListSelected : Array<any>;
  public idsListSelected: Array<number>;
  selectedFiles: FileList;
  currentFileUpload: File;
  public idRole: number;

  constructor(
    private deliverablesService : DeliverableService, 
    private uploadService : UploadfileService, 
    private authService: AuthGuardService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
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
    this.validateRole();
    this.getAllDeliverables();
  }

  validateRole() {
    this.idRole = this.authService.userRole;
  }

  addDeliverable(deliverable? : any) {
    let deliverableSelected = {
      id: (deliverable) ? deliverable.id : parseInt(this.deliverableForm.get('deliverableSelected').value),
      nombre: '',
      peso: (deliverable && deliverable.weigth) ? deliverable.weigth : 0,
      idArchivo: (deliverable && deliverable.fileId) ? deliverable.fileId : 0,
      estado: (deliverable && deliverable.status) ? deliverable.status : 'I'
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
      this.deliverableSelection.emit((deliverable) ? deliverable : deliverableSelected);
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
        this.deleteDeliverable.emit(deliverableId);
      }
    }
  }

  selectFile(event, deliverableId) {
    this.currentFileUpload = event.target.files[0];
    if (this.currentFileUpload) {
      this.uploadFile(deliverableId);
    } else {
      this.openModal('No se seleccionó ningún archivo válido!');
    }
  }
  
  uploadFile(deliverableId) {
    let body = new FormData();
    body.append("file", this.currentFileUpload);
    this.uploadService.pushFileToStorage(body).subscribe(
      response => {
        let resJson: any = response.json();
        if (resJson.fileId > 0) {
          let bodyDb = {
            id: {
              idEtapa: this.stageId,
              idEntregable: deliverableId,
              idProyecto: this.projectId
            },
            idArchivo: resJson.fileId
          }
          this.deliverablesService.updateDeliverableByProject(bodyDb).subscribe(
            res => {
              let responseJson: any = res.json();
              this.openModal(responseJson.responseMessage);
              for (let index = 0; index < this.deliverablesListSelected.length; index++) {
                const deliverable = this.deliverablesListSelected[index];
                if (deliverable.id == deliverableId) {
                  this.deliverablesListSelected[index].idArchivo = bodyDb.idArchivo;
                }
              }
            },
            error => this.openModal('Error guardando información del archivo: ' + error.responseMessage)
          );
        }
      },
      error => this.openModal('Error cargando archivo: ' + error.responseMessage)
    );  
    this.currentFileUpload = undefined;
  }

  updateDeliverable(deliverableId, status) {
    let body = {
      id: {
        idEtapa: this.stageId,
        idEntregable: deliverableId,
        idProyecto: this.projectId
      },
      estado: status
    }
    this.deliverablesService.updateDeliverableByProject(body).subscribe(
      res => {
        let responseJson: any = res.json();
        this.openModal(responseJson.responseMessage);
        for (let index = 0; index < this.deliverablesListSelected.length; index++) {
          const deliverable = this.deliverablesListSelected[index];
          if (deliverable.id == deliverableId) {
            this.deliverablesListSelected[index].estado = status;
          }
        }
      },
      error => this.openModal('Error guardando información del archivo: ' + error.responseMessage)
    );  
  }

  downloadFile(deliverableId) {
    let body = {
      stageId: this.stageId,
      deliverableId: deliverableId,
      projectId: this.projectId
    }
    this.uploadService.getFileByDeliverable(body).subscribe(
      res => {
        let responseJson: any = res.json();
        if (responseJson.file) {
          let pdf:any = {};
          pdf.name = responseJson.file.name;
          pdf.path = responseJson.file.path;
          let name = 'guia-articulo-academico.pdf'
          let path = 'https://si.ua.es/es/documentos/documentacion/pdf-s/mozilla12-pdf.pdf';
          this.uploadService.getFileBlob(pdf.path/*path*/).subscribe(
            res => {
              pdf.content = res.blob();
              let link = document.createElement("a");
              link.href = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, 
                this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(pdf.content)));
              link.download = pdf.name/*name*/;
              link.dispatchEvent(new MouseEvent("click"));
            },
            error => this.openModal('Error al descargar el archivo')
          );
        } else {
          this.openModal('Error descargando el archivo: ' + responseJson.responseMessage)
        }
      },
      error => this.openModal('Error descargando el archivo: ' + error.responseMessage)
    );
    /**/
  }

  getAllDeliverables() {
    let deliverableDefault = {
      id: 0
    }
    this.deliverablesList = new Array();
    this.deliverablesList.push(deliverableDefault);
    this.deliverablesService.getAllDeliverables().subscribe(
      response => {
        let resJson: any = response.json();
        this.deliverablesList = resJson.deliverableList;
        if (this.deliverables)
        this.deliverables.forEach(deliverable => {
          this.addDeliverable(deliverable);
        });
      },
      error => this.openModal('Error al cargar lista de entregables: ' + error.responseMessage)
    );
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Entregables';
    modalRef.componentInstance.content = content;
  }

}
