import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { EditProjectComponent } from 'src/app/pages/edit-project/edit-project.component';
import { StagesComponent } from 'src/app/pages/stages/stages.component';
import { ClientesComponent } from 'src/app/pages/clientes/clientes.component';
import { TeamsComponent } from 'src/app/pages/teams/teams.component';
import { PaymentMethodsComponent } from 'src/app/pages/payment-methods/payment-methods.component';
import { ContractsComponent } from 'src/app/pages/contracts/contracts.component';
import { ManageComponent } from 'src/app/pages/manage/manage.component';
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: "contracts", component: ContractsComponent, canActivate: [AuthGuardService] },
  { path: "notifications", component: NotificationsComponent, canActivate: [AuthGuardService] },
  { path: "user", component: UserComponent },
  { path: "edit-project", component: EditProjectComponent, canActivate: [AuthGuardService] },
  { path: "stages", component: StagesComponent, canActivate: [AuthGuardService] },
  { path: "clients", component: ClientesComponent, canActivate: [AuthGuardService] },
  { path: "teams", component: TeamsComponent, canActivate: [AuthGuardService] },
  { path: "payment-methods", component: PaymentMethodsComponent, canActivate: [AuthGuardService] },
  { path: "tables", component: TablesComponent, canActivate: [AuthGuardService] },
  { path: "typography", component: TypographyComponent, canActivate: [AuthGuardService] },
  { path: "icons", component: IconsComponent, canActivate: [AuthGuardService] },
  { path: "manage", component: ManageComponent, canActivate: [AuthGuardService] }
];
