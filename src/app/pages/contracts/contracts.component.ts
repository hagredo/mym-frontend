import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract/contract.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';
import { ProjectService } from 'src/app/services/projects/project.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  private error: boolean = false;
  private errorMessage: string = '';

  public contractForm: FormGroup;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public contractList : any;
  public contractSelected: any;
  public isNewContract: boolean;
  public projectListSelected: Array<any>;
  public projectListToSend : Array<any>;
  public projectIdList : Array<number>;
  public idRole: number;

  constructor(
    private contractService : ContractService,
    private projectService : ProjectService,
    private modalService: NgbModal,
    private authService: AuthGuardService
  ) {
    this.isNewContract = true;
    this.contractSelected = {};
    this.projectListSelected = new Array<any>();
    this.projectListToSend = new Array<any>();
    this.projectIdList = new Array<number>();
    this.contractForm = new FormGroup({
      contractNumber: new FormControl('', Validators.required),
      contractName: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.validateRole();
    this.getAllContracts();
  }
  
  validateRole() {
    this.idRole = this.authService.userRole;
  }

  saveContract() {
    this.validateContractWeigth();
    if (!this.error) {
      let body = this.buildContractBody();
      if (!this.isNewContract && this.contractSelected && this.contractSelected.id > 0) {
        body.contract.id = this.contractSelected.id
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
    } else {
      this.openModal(this.errorMessage);
      this.error = false;
      this.errorMessage = '';
    }
  }

  validateContractWeigth() {
    let conttractWeigth = 0;
    if (this.projectListToSend.length > 0) {
      this.projectListToSend.forEach(project => {
        conttractWeigth += parseInt(project.weight);
      });
    } else {
      conttractWeigth = 100;
    }
    if (conttractWeigth != 100) {
      this.error = true;
      this.errorMessage = 'Error: Los Proyectos del Contrato deben sumar 100';
    }
  }

  buildContractBody():any {
    let body = {
      contract: {
        numeroContrato: this.contractForm.get('contractNumber').value,
        nombre: this.contractForm.get('contractName').value
      },
      projectWeightList: this.projectListToSend
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

  editContract() {
    this.contractForm.get('contractNumber').setValue(this.contractSelected.numeroContrato);
    this.contractForm.get('contractName').setValue(this.contractSelected.nombre);
    this.isNewContract = false;
    this.projectService.getProjectsByContract(this.contractSelected.id).subscribe(
      response => {
        this.projectListSelected = response.json().projectList;
        this.projectListSelected.forEach(project => {
          if (project.estado === 'C') {
            project.estado = 'CREADO';
          } else if (project.estado === 'E') {
            project.estado = 'EN EJECUCIÓN';
          } else if (project.estado === 'F') {
            project.estado = 'FINALIZADO';
          }
          this.onWeigthChange(project.id, project.peso);
        });
      }
    );
  }
  
  onWeigthChange(projectId:number, peso:number) {
    let projectWeight = {
      idProject: projectId,
      weight: peso
    }
    if(!this.projectIdList.includes(projectId)) {
      this.projectIdList.push(projectId);
      this.projectListToSend.push(projectWeight);
    } else {
      for (let index = 0; index < this.projectListToSend.length; index++) {
        const project = this.projectListToSend[index];
        if (project.idProject == projectId) {
          this.projectListToSend[index] = projectWeight;
        }
      }
    }
  }

  cleanForm() {
    this.contractForm.get('contractNumber').setValue('');
    this.contractForm.get('contractName').setValue('');
    this.isNewContract = true;
    this.clicked1 = false;
    this.clicked2 = false;
    this.projectListSelected = new Array<any>();
    this.projectListToSend = new Array<any>();
    this.projectIdList = new Array<number>();
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
        if (error.status != 404) {
          this.openModal('Error: ' + 'Error al cargar lista de contratos');
        }
      }
    );
  }

}
