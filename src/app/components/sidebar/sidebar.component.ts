import { Component, OnInit } from "@angular/core";
import { MenuService } from 'src/app/services/menu/menu.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';

declare interface RouteInfo {
  id: number,
  path: string;
  title: string;
  icon: string;
}
export let ROUTES: RouteInfo[] = [
  {
    id: 1,
    path: "/dashboard",
    title: "Dashboard",
    icon: "icon-chart-pie-36"
  },
  {
    id: 2,
    path: "/contracts",
    title: "Contratos",
    icon: "icon-notes"
  },
  {
    id: 3,
    path: "/clients",
    title: "Clientes",
    icon: "icon-satisfied"
  },
  {
    id: 4,
    path: "/stages",
    title: "Etapas",
    icon: "icon-puzzle-10"
  },
  {
    id: 5,
    path: "/teams",
    title: "Equipos",
    icon: "icon-single-02"
  },
  {
    id: 6,
    path: "/payment-methods",
    title: "Formas de pago",
    icon: "icon-coins"
  },
  {
    id: 7,
    path: "/notifications",
    title: "Notificaciones",
    icon: "icon-bell-55"
  },
  {
    id: 8,
    path: "/icons",
    title: "Informes",
    icon: "icon-paper"
  },
  {
    id: 9,
    path: "/typography",
    title: "Archivos",
    icon: "icon-single-copy-04"
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor(
    private menuService: MenuService,
    private authService: AuthGuardService
  ) {}

  ngOnInit() {
    this.getMenuByRole();
  }

  getMenuByRole() {
    console.log(this.authService.userRole);
    this.menuService.getMenuByRole(this.authService.userRole).subscribe(
      response => {
        let resJson: any = response.json();
        ROUTES = resJson.menuList;
        this.menuItems = ROUTES.filter(menuItem => menuItem);
      },
      error => {
        console.log('Error al cargar el menu');
      }
    );
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

}
