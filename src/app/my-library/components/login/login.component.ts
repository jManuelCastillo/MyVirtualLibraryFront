import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { BookmarkService } from '../../service/bookmark.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DialogService]
})
export class LoginComponent {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) { }



  loginForm: FormGroup = this.formBuilder.group({
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  })

  async login() {

    if (this.loginForm.valid) {
      await this.userService.getUser(this.loginForm.value.emailInput, this.loginForm.value.passwordInput)
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  }




  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      console.log(response);
    }).catch(error => console.log(error)
    )
  }

}
