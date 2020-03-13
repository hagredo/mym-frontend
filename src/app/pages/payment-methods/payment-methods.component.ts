import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PaymentMethodService } from 'src/app/services/paymentmethod/payment-method.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {

  public paymentMethodForm: FormGroup;
  public paymentArray: FormArray;
  public clicked2: boolean = false;
  public paymentMethodList: Array<any>;
  public paymentMethodSelected: any;
  
  constructor(
    private paymentMethodService : PaymentMethodService,
    private modalService: NgbModal
  ) {
    this.paymentMethodList = new Array<any>();
    this.paymentMethodSelected = {};
    this.paymentArray = new FormArray([]);
    this.paymentMethodForm = new FormGroup({
      paymentsNumber: new FormControl('', Validators.required),
      payments: this.paymentArray
    });
  }

  ngOnInit() {
    this.getAllPaymentMethods();
  }

  savePaymentMethod() {
    let paymentMethodDescription = '';
    this.paymentArray.controls.forEach(paymentPercent => {
      paymentMethodDescription += paymentPercent.value + '-';
    });
    paymentMethodDescription = paymentMethodDescription.substring(0, paymentMethodDescription.length - 1);
    let body = {
      descripcion: paymentMethodDescription
    }
    this.paymentMethodService.savePaymentMethod(body).subscribe(
      response => {
        this.getAllPaymentMethods();
        this.openModal(response.json().responseMessage);
        this.cleanForm();
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
  }

  deletePaymentMethod() {
    this.paymentMethodService.deletePaymentMethod(this.paymentMethodSelected.id).subscribe(
      response => {
        this.getAllPaymentMethods();
        this.openModal(response.json().responseMessage);
        this.cleanForm();
      },
      error => {
        this.openModal('Error: ' + error.responseMessage);
      }
    );
  }

  addPaymentMethod() {
    let paymentsNumber = this.paymentMethodForm.get('paymentsNumber').value;
    for (let index = 0; index < paymentsNumber; index++) {
      this.paymentArray.push(new FormControl('', Validators.required));
    }
  }

  selectPaymentMethod(paymentMethodId:number) {
    this.cleanForm();
    this.clicked2 = false;
    this.paymentMethodList.forEach(paymentMethod => {
      if (paymentMethod.id == paymentMethodId)
        this.paymentMethodSelected = paymentMethod;
    });
  }

  openModal(content:string) {
    const modalRef = this.modalService.open(NgbdModalContentComponent);
    modalRef.componentInstance.title = 'Guardar forma de pago';
    modalRef.componentInstance.content = content;
  }

  cleanForm() {
    this.paymentArray = new FormArray([]);
    this.paymentMethodForm.get('paymentsNumber').setValue('');
    this.clicked2 = false;
  }

  getAllPaymentMethods() {
    this.paymentMethodList = new Array();
    this.paymentMethodService.getAllPaymentMethods().subscribe(
      response => {
        let resJson : any = response.json();
        this.paymentMethodList = resJson.paymentMethodList;
        this.paymentMethodSelected = this.paymentMethodList[0];
      },
      error => {
        console.log('Error al cargar lista de formas de pago');
      }
    );
  }

}
