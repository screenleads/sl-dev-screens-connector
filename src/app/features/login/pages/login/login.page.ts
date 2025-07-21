import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { IonContent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent } from 'sl-dev-components';

@Component({
  standalone: true,
  selector: 'app-login',
    imports: [
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule, FormsModule, SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthenticationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  username ="";
  password = "";
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    this.http.post<{ token: string }>('https://sl-dev-backend-7ab91220ba93.herokuapp.com/auth/login', this.form.value)
      .subscribe({
        next: res => {
          this.auth.loginSuccess(res.token);
          this.router.navigateByUrl(returnUrl);
        },
        error: () => alert('Credenciales inválidas')
      });
  }
}
