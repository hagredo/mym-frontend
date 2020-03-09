import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  public clientForm: FormGroup;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clientList : any;
  public clientSelected: any;

  constructor(
    private clientsService : ClientsService,
    private modalService: NgbModal
  ) {
    this.clientSelected = {};
    this.clientForm = new FormGroup({
      identification: new FormControl('', Validators.required),
      clientName: new FormControl('', Validators.required),
      addressClient: new FormControl('', Validators.required),
      clientPhone: new FormControl('', Validators.required),
      contact: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllClients();
  }

  saveClient() {
    let body = {
      id: this.clientForm.get('identification').value,
      nombre: this.clientForm.get('clientName').value,
      direccion: this.clientForm.get('addressClient').value,
      telefono: this.clientForm.get('clientPhone').value,
      contacto: this.clientForm.get('contact').value
    }
    this.clientsService.saveClient(body).subscribe(
      response => {
        this.openModal(response.json().responseMessage);
        this.cleanForm();
        this.getAllClients();
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar cliente';
    modalRef.componentInstance.content = content;
  }

  cleanForm() {
    this.clientForm.get('identification').setValue('');
    this.clientForm.get('clientName').setValue('');
    this.clientForm.get('addressClient').setValue('');
    this.clientForm.get('clientPhone').setValue('');
    this.clientForm.get('contact').setValue('');
  }

  selectClient(clientId:number) {
    this.cleanForm();
    this.clicked1 = false;
    this.clicked2 = false;
    this.clientList.forEach(client => {
      if (client.id == clientId)
        this.clientSelected = client;
    });
  }

  editClient() {
    this.clientForm.get('identification').setValue(this.clientSelected.id);
    this.clientForm.get('clientName').setValue(this.clientSelected.nombre);
    this.clientForm.get('addressClient').setValue(this.clientSelected.direccion);
    this.clientForm.get('clientPhone').setValue(this.clientSelected.telefono);
    this.clientForm.get('contact').setValue(this.clientSelected.contacto);
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
        this.clientSelected = this.clientList[0];
      },
      error => {
        console.log('Error al cargar lista de clientes');
      }
    );
  }

}
