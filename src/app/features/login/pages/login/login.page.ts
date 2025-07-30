import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { IonContent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent } from 'sl-dev-components';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { DevicesService } from 'src/app/features/loading/services/loading.service';

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
  private config = inject(APP_CONFIG);

  username = "";
  password = "";
  form = this.fb.group({
    username: ['jato2', Validators.required],
    password: ['52866617jJ@2', Validators.required]
  });



  constructor(private _deviceSrv: DevicesService) { }

  login() {
    // const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    const returnUrl = '/connect';
    console.log(`LOGIN CONTRA :::::: ${this.config.apiUrl}/auth/login`);
    console.log(this.form.value);
    this.http.post<{ token: string, user: any }>(`${this.config.apiUrl}/auth/login`, this.form.value)
      .subscribe({
        next: res => {
          console.log(res);
          this.auth.loginSuccess(res);
          this._deviceSrv.getDeviceTypes();
          // this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          console.log(err);
          alert('Credenciales inválidas por error en llamada')
        }
      });
  }
}
