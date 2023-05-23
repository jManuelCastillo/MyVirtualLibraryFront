import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { BookmarkService } from '../../service/bookmark.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DialogService, MessageService,]
})
export class LoginComponent {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public messageService: MessageService,
  ) { }



  loginForm: FormGroup = this.formBuilder.group({
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  })

  async login() {

    if (this.loginForm.valid) {
      await this.userService.getUser(this.loginForm.value.emailInput, this.loginForm.value.passwordInput).then(response => {
        if (localStorage.getItem('user') != undefined) {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Sesión iniciada` });
          setTimeout(() => {
            location.reload();
          }, 2000);
          
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Usuario incorrecto', detail: `Los datos de usuario son incorrectos` });
        }
      })

    }
  }

}
