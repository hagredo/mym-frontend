import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ShowAlertService } from '../services/showAlerts/show-alert.service';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, HttpClientModule, HttpModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent],
  exports: [FooterComponent, NavbarComponent, SidebarComponent],
  providers: [ShowAlertService]
})
export class ComponentsModule {}
