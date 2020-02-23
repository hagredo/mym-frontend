import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { EditProjectComponent } from 'src/app/pages/edit-project/edit-project.component';
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: "icons", component: IconsComponent, canActivate: [AuthGuardService] },
  { path: "maps", component: MapComponent, canActivate: [AuthGuardService] },
  { path: "notifications", component: NotificationsComponent, canActivate: [AuthGuardService] },
  { path: "user", component: UserComponent },
  { path: "tables", component: TablesComponent, canActivate: [AuthGuardService] },
  { path: "typography", component: TypographyComponent, canActivate: [AuthGuardService] },
  { path: "edit-project", component: EditProjectComponent, canActivate: [AuthGuardService] },
  // { path: "rtl", component: RtlComponent }
];
