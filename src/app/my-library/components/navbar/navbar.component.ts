import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NavbarComponent implements OnInit {

  items: MenuItem[] = [];
  items2: MenuItem[] = [];
  activeItem: MenuItem = {};
  fileInput: any;
  currentUser?: User;
  sidebarVisible2: boolean = false;

  constructor(
    private userService: UserService, private cd: ChangeDetectorRef) { }


  showLogin() {
    /*  this.libraryService.currentPdf = route; */
    this.userService.show()
  }

  getStateUser(){
    return localStorage.getItem('user')
  }

  ngOnInit() {
    this.userService.getLocalUser()
    if (localStorage.getItem('user')) {
      this.currentUser = this.userService.currentUser ;
      this.currentUser?.favouritesBooks?.length
    }
    
    this.setItems()

    this.items2 = [
      { label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: (event) => this.logOut() },
      { label: 'Favoritos', icon: 'pi pi-star-fill', command: (event) => this.sidebarVisible2 = !this.sidebarVisible2 },
      { label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: (event) => this.logOut() },
    ]

    this.activeItem = this.items[0];
  }

  setItems(){
    this.items = [
      { label: 'Inicio', icon: 'pi pi-home', 'routerLink': "/home" },
      { label: 'Colecciones', icon: 'pi pi-book', 'routerLink': "/collection" },
    ];
    
    if ( this.currentUser != undefined && this.currentUser.admin) {
      this.items.push({ label: 'Administrar', icon: 'pi pi-wrench', 'routerLink': "/manage" })
    }
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activateLast() {
    this.activeItem = this.items[this.items.length - 1];
  }

  logOut() {
    localStorage.clear()
    this.currentUser = undefined;
    this.setItems()
    this.userService.logout().catch(error => console.log(error));
  }
}
