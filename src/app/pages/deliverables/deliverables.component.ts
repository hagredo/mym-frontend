import { Component, OnInit, Input } from '@angular/core';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss']
})
export class DeliverablesComponent implements OnInit {

  @Input() stageId: number;
  
  public deliverableForm: FormGroup;
  public deliverablesList : Array<any>;
  public deliverablesListSelected : Array<any>;

  constructor(private deliverablesService : DeliverableService) {
    this.deliverablesListSelected = new Array<any>();
    this.deliverableForm = new FormGroup({
      deliverableSelected : new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getAllDeliverables();
  }

  addDeliverable() {
    let stageSelected;
    this.deliverablesList.forEach(stage => {
      if (stage.id == this.deliverableForm.get('deliverableSelected').value)
        stageSelected = stage;
    });
    if(!this.deliverablesListSelected.includes(stageSelected) && stageSelected) {
      this.deliverablesListSelected.push(stageSelected);
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
