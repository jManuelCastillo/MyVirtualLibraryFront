import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  loginForm: FormGroup = this.formBuilder.group({
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  })

  login() {

    if (this.loginForm.valid) {

      this.userService.login(this.loginForm.value.emailInput, this.loginForm.value.passwordInput)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));
    }
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle().then(response => {
      console.log(response);
    }).catch(error => console.log(error)
    )
  }

}
