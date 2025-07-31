import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Credentials } from 'src/app/shared/models/credentials';
import { SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent } from 'sl-dev-components';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent ]
})
export class LoginPage {
  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
 private authService = inject(AuthenticationService); 
  constructor(
    private fb: FormBuilder
  ) {}

  login() {
    if (this.form.valid) {
      const values = this.form.getRawValue();
      const credentials = new Credentials({
        username: values.username ?? '',
        password: values.password ?? '',
      });
      this.authService.login(credentials);
    }
  }
}
