import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  registerForm: FormGroup = this.formBuilder.group({
    nameInput: [, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
  })

  register() {
    console.log('hola');


    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value.emailInput, this.registerForm.value.passwordInput)
        .then(response => {
          console.log(response);

        })
        .catch(error => console.log(error));
    }

  }
}
