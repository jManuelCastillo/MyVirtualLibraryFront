import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  items: MenuItem[] = [];
  activeItem: MenuItem = {};

  ngOnInit() {
    this.items = [
      { label: 'Inicio', icon: 'pi pi-home', 'routerLink': "/home"},
      { label: 'Colecciones', icon: 'pi pi-book', 'routerLink': "/collection" },
      { label: 'Administrar', icon: 'pi pi-wrench', 'routerLink': "/manage" }
    ];

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activateLast() {
    this.activeItem = this.items[this.items.length - 1];
  }
}
