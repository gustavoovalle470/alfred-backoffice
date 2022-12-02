import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { ServicesService } from 'src/app/business/API/system/services.service';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styles: [`
		:host ::ng-deep .p-message {
			margin-left: .25em;
		}

        :host ::ng-deep .p-toast{
            z-index:99999;
        }
    `],
  providers: [MessageService]
})
export class AppLoginComponent extends JGSComponent implements OnInit{
  loading;
  loginForm : FormGroup;
  errorMessages = {
      username:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Usuario no valido'}
      ],
      password:[
        {type:'required', message:'Campo requerido'}
      ]
  };
  servicesOnline: boolean = true;

  
  constructor(private formBuilder : FormBuilder,
              private securityService : SecurityService,
              private router : Router,
              private serviceServices : ServicesService,
              menulink : MenulinkService,
              messageService: MessageService)
  { super(messageService, securityService, '/dashboard', menulink); }
  endpoints: Map<string, string>;

 async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username:['', Validators.compose([
                    Validators.required,
                    Validators.pattern('^[A-Za-z0-9]+$')
      ])],
      password:['', [Validators.required]
      ]
    });
    try{
      await this.serviceServices.serviceStatus();
    } catch (exception){
      this.router.navigate(['error']);
    }
  }

  get errorControl(){
    return this.loginForm.controls;
  }

  async doLogin(){
    localStorage.clear();
    if(this.securityService.isOnlineService() && this.loginForm.valid){
      await this.securityService.doLogginUserSystem(this.message);
      if(await this.securityService.doLogin(this.loginForm.get("username").value, 
      this.loginForm.get("password").value , this.message)){
        this.router.navigate(['/alfred/dashboard'])
      }
      this.loginForm.reset();
    }
  }

  goToRecovery(){
    this.router.navigate(['/recover-password']);
  }
}
