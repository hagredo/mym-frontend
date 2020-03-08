import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/edit-project",
    title: "Proyectos",
    rtlTitle: "لوحة القيادة",
    icon: "icon-notes",
    class: ""
  },
  {
    path: "/clients",
    title: "Clientes",
    rtlTitle: "الرموز",
    icon: "icon-satisfied",
    class: ""
  },
  {
    path: "/stages",
    title: "Etapas",
    rtlTitle: "قائمة الجدول",
    icon: "icon-puzzle-10",
    class: ""
  },
  {
    path: "/maps",
    title: "Equipos",
    rtlTitle: "خرائط",
    icon: "icon-single-02",
    class: "" },
  {
    path: "/notifications",
    title: "Notificaciones",
    rtlTitle: "إخطارات",
    icon: "icon-bell-55",
    class: ""
  },

  {
    path: "/user",
    title: "Informes",
    rtlTitle: "ملف تعريفي للمستخدم",
    icon: "icon-paper",
    class: ""
  },
  {
    path: "/typography",
    title: "Archivos",
    rtlTitle: "طباعة",
    icon: "icon-single-copy-04",
    class: ""
  }/*,
  {
    path: "/rtl",
    title: "RTL Support",
    rtlTitle: "ار تي ال",
    icon: "icon-world",
    class: ""
  }*/
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
