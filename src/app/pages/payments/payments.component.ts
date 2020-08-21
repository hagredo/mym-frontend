import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/projects/project.service';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  public paymentForm: FormGroup;
  public paymentList: Array<any>;
  public paymentSelected: any;
  public projectSelected: any;
  public isNewPayment: boolean;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public totalValue: number = 0;
  public paidValue: number = 0;
  public percent: number = 0;
  
  constructor(
    private router: Router,
    private paymentsService : PaymentsService,
    private projectService : ProjectService,
    private modalService: NgbModal
  ) { 
    this.paymentList = new Array<any>();
    this.paymentSelected = {};
    this.isNewPayment = true;
    this.paymentForm = new FormGroup({
      paymentValue: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.projectSelected = this.projectService.getProject();
    this.getPaymentsByProject(this.projectSelected.id);
  }

  selectPayment(paymentId:number) {
    this.cleanForm();
    this.clicked1 = false;
    this.clicked2 = false;
    this.paymentList.forEach(payment => {
      if (payment.id == paymentId)
        this.paymentSelected = payment;
    });
  }

  editPayment() {
    this.isNewPayment = false;
    this.paymentForm.get('paymentValue').setValue(this.paymentSelected.valorPago);
  }

  savePayment(){
    let body = this.buildPaymentBody();
    if (!this.isNewPayment && this.paymentSelected && this.paymentSelected.id > 0) {
      body.pago.id = this.paymentSelected.id;
    }
    this.paymentsService.savePayment(body).subscribe(
      response => {
        this.getPaymentsByProject(this.projectSelected.id);
        this.openModal(response.json().responseMessage);
        this.cleanForm();
      },
      error => this.openModal('Error: ' + error.responseMessage)
    );
  }

  deletePayment() {
    if (this.paymentSelected && this.paymentSelected.id > 0) {
      this.paymentsService.deletePayment(this.paymentSelected.id).subscribe(
        response => {
          this.getPaymentsByProject(this.projectSelected.id);
          this.openModal(response.json().responseMessage);
          this.cleanForm();
        },
        error => this.openModal('Error: ' + error.responseMessage)
      );
    }
  }

  buildPaymentBody(): any{
    let body = {
      valor: {
        idProyecto: this.projectSelected.id
      },
      pago: {
        valorPago: this.paymentForm.get('paymentValue').value
      }
    }
    return body;
  }

  cleanForm() {
    this.paymentForm.get('paymentValue').setValue('');
    this.clicked1 = false;
    this.clicked2 = false;
    this.isNewPayment = true;
  }

  getProjectValue() {
    this.totalValue = 0;
    this.paidValue = 0;
    this.percent = 0;
    this.projectService.getValueByProject(this.projectSelected.id).subscribe(response => {
      let valor = response.json().valor;
      this.totalValue = valor.total;
      this.paymentList.forEach(payment => {
        this.paidValue += payment.valorPago;
      });
      this.percent = (this.paidValue/this.totalValue)*100;
    });
  }

  getPaymentsByProject(projectId) {
    this.paymentsService.getPaymentsByProject(projectId).subscribe(
      response => {
        let resJson: any = response.json();
        this.paymentList = resJson.paymentsByProject;
        this.paymentSelected = this.paymentList[0];
        this.getProjectValue();
        if (this.paymentList.length <= 0) {
          this.openModal('No se registran pagos para este proyecto');
        }
      },
      error => this.openModal('Error: ' + error.responseMessage)
    );
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Pagos';
    modalRef.componentInstance.content = content;
  }

  goBack(){
    this.router.navigate(['/dashboard']);
  }

}
