import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserIt } from '../../interfaces/user.interface';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

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
  currentUser?: UserIt;
  sidebarVisible1: boolean = false;
  sidebarVisible2: boolean = false;
  visibleLogin: boolean = false;

  constructor(
    private userService: UserService, private cd: ChangeDetectorRef,
    private router: Router) { }


  showLogin() {
    /*  this.libraryService.currentPdf = route; */
    /* this.userService.show() */
    this.visibleLogin = true
  }

  getStateUser() {
    return localStorage.getItem('user')
  }

  ngOnInit() {
    this.userService.getLocalUser()
    if (localStorage.getItem('user')) {
      this.currentUser = this.userService.currentUser;
      this.currentUser?.favouritesBooks?.length
    }

    this.setItems()

    this.items2 = [
      { title: 'Favoritos', icon: 'pi pi-star-fill', command: (event) => this.sidebarVisible1 = !this.sidebarVisible1 },
      { title: 'Leidos', icon: 'pi pi-eye-slash', command: (event) => this.sidebarVisible2 = !this.sidebarVisible2 },
      {
        title: 'Cerrar Sesión', icon: 'pi pi-power-off', command: (event) => {
          this.logOut()
          this.router.navigate(['/home']);
        }
      },
    ]

    this.activeItem = this.items[0];
  }

  setItems() {
    this.items = [
      { label: 'Inicio', icon: 'pi pi-home', 'routerLink': "/home" },
      { label: 'Colecciones', icon: 'pi pi-book', 'routerLink': "/collection" },
    ];

    if (this.currentUser != undefined && this.currentUser.admin) {
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

  showInfo(bookId: string) {
    this.router.navigate(['/bookinfo', bookId]);
  }

}