import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private deliverablesService : DeliverableService) {
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

}
