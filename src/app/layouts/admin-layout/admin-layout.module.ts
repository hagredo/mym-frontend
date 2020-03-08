import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

import { NgbActiveModal, NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from 'src/app/services/user/user.service';
import { HttpModule } from '@angular/http';
import { EditProjectComponent } from 'src/app/pages/edit-project/edit-project.component';
import { HttpConfig } from 'src/app/util/HttpConfig';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { StageService } from 'src/app/services/stages/stage.service';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { CityService } from 'src/app/services/cities/city.service';
import { SaveService } from 'src/app/services/saveproyect/save.service';
import { BusinessCardComponent } from 'src/app/pages/components/business-card/business-card.component';
import { DeliverableService } from 'src/app/services/deliverables/deliverable.service';
import { StagesComponent } from 'src/app/pages/stages/stages.component';
import { ClientesComponent } from 'src/app/pages/clientes/clientes.component';
import { DeliverablesComponent } from 'src/app/pages/deliverables/deliverables.component';
import { PaymentMethodService } from 'src/app/services/paymentmethod/payment-method.service';
import { NgbdModalContentComponent } from 'src/app/components/ngbd-modal-content/ngbd-modal-content.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    HttpModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    MapComponent,
    EditProjectComponent,
    BusinessCardComponent,
    StagesComponent,
    ClientesComponent, 
    DeliverablesComponent, 
    NgbdModalContentComponent
  ],
  entryComponents: [NgbdModalContentComponent],
  providers: [
    UserService,
    HttpConfig,
    ClientsService,
    StageService,
    TeamsService,
    CityService,
    SaveService,
    DeliverableService,
    PaymentMethodService
  ]
})
export class AdminLayoutModule {}
