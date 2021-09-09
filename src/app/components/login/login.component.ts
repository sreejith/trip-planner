import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserData } from 'src/app/models/user-data';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isFormValid = false;
  isCredentialsInvalid = false;

  hide = true;

  public loginInvalid = false;
  public validationInprogress: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loginInvalid = false;
    if (this.form.valid) {
        this.validationInprogress = true;
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        const userData = new UserData(username, password);
        setTimeout(()=>{
          if (!this.authenticationService.authenticate(userData)) {
            this.isFormValid = false;
            this.isCredentialsInvalid = true;
            this.validationInprogress = false;
          }
        }, 1000);
    }
  }


}
