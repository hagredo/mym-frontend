import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbd-modal-content',
  templateUrl: './ngbd-modal-content.component.html',
  styleUrls: ['./ngbd-modal-content.component.scss']
})
export class NgbdModalContentComponent implements OnInit {
  
  @Input() title;
  @Input() content;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

}
