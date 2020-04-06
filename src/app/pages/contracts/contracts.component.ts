import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract/contract.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  public contractForm: FormGroup;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public contractList : any;
  public contractSelected: any;
  public isNewContract: boolean;

  constructor(
    private contractService : ContractService,
    private modalService: NgbModal
  ) {
    this.contractSelected = {};
    this,this.isNewContract = true;
    this.contractForm = new FormGroup({
      contractNumber: new FormControl('', Validators.required),
      contractName: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllContracts();
  }
  
  saveContract() {
    let body = this.buildContractBody();
    if (!this.isNewContract && this.contractSelected && this.contractSelected.id > 0) {
      body.id = this.contractSelected.id
    }
    this.contractService.saveContract(body).subscribe(
      response => {
        this.openModal(response.json().responseMessage);
        this.cleanForm();
        this.getAllContracts();
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
  }

  buildContractBody():any {
    let body = {
      numeroContrato: this.contractForm.get('contractNumber').value,
      nombre: this.contractForm.get('contractName').value
    }
    return body;
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar contrato';
    modalRef.componentInstance.content = content;
  }

  selectContract(contractId:number) {
    this.cleanForm();
    this.clicked1 = false;
    this.clicked2 = false;
    this.contractList.forEach(contract => {
      if (contract.id == contractId)
        this.contractSelected = contract;
    });
  }

  cleanForm() {
    this.contractForm.get('contractNumber').setValue('');
    this.contractForm.get('contractName').setValue('');
    this.isNewContract = true;
    this.clicked1 = false;
    this.clicked2 = false;
  }

  editContract() {
    this.isNewContract = false;
    this.contractForm.get('contractNumber').setValue(this.contractSelected.numeroContrato);
    this.contractForm.get('contractName').setValue(this.contractSelected.nombre);
  }
  
  getAllContracts(){
    let contractDefault = {
      id: 0
    }
    this.contractList = new Array();
    this.contractList.push(contractDefault);
    this.contractService.getAllContracts().subscribe(
      response => {
        let resJson: any = response.json();
        this.contractList = resJson.contractList;
        this.contractSelected = this.contractList[0];
      },
      error => {
        console.log('Error al cargar lista de contratos');
      }
    );
  }

}
