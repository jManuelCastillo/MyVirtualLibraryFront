import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  emailExist: boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService, 
    private messageService: MessageService
  ) { }


  registerForm: FormGroup = this.formBuilder.group({
    nameInput: [, [Validators.required,  Validators.maxLength(50)]],
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(6), Validators.maxLength(25), this.passwordValidator]],
  })


  validFieldRegister(field: string) {
    return this.registerForm.controls[field].errors &&
      this.registerForm.controls[field].touched
  }

  register() {

    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value.emailInput, this.registerForm.value.passwordInput)
        .then(response => {
          this.userService.registerUserData(response.user.uid, this.registerForm.value.nameInput, this.registerForm.value.emailInput)
            .then(response => {
              this.messageService.add({ severity: 'success', summary: 'Nuevo usuario agregado', detail: '' });
            })
            .catch(error => console.log(error));
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/email-already-in-use') {
            this.emailExist = true
          }
          console.log(errorMessage);
        });
    }
  }

  passwordValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);
    const hasSymbol = /[$&+,:;=?@#|'<>.^*()%!-]/.test(control.value);
    const valid = hasUppercase && hasNumber && hasSymbol;
    return valid ? null : { invalidPassword: true };
  }
}
