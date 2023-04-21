import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LibraryService } from '../../service/library.service';
import { LoginComponent } from '../login/login.component';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DialogService]
})
export class NavbarComponent {

  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  ref!: DynamicDialogRef;
  fileInput: any;
  currentUser: User | undefined;

  constructor(
    private libraryService: LibraryService,
    private dialogService: DialogService,
    private userService: UserService) { }

  showLogin() {
    /*  this.libraryService.currentPdf = route; */
    this.ref = this.dialogService.open(LoginComponent, {
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }


  ngOnInit() {
    this.currentUser = this.libraryService.currentUser ?? undefined;

    this.items = [
      { label: 'Inicio', icon: 'pi pi-home', 'routerLink': "/home" },
      { label: 'Colecciones', icon: 'pi pi-book', 'routerLink': "/collection" },
    ];
    // if(this.currentUser !== undefined && this.currentUser.admin){
    if (true) {
      this.items.push({ label: 'Administrar', icon: 'pi pi-wrench', 'routerLink': "/manage" })
    }

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activateLast() {
    this.activeItem = this.items[this.items.length - 1];
  }

  logOut() {
      this.userService.logout().catch(error => console.log(error));
  }
}
