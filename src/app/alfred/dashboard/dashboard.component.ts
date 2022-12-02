import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/alfred/breadcrumb/app.breadcrumb.service';
import { JGSOutput } from 'src/app/business/API/model/outputs/jgsoutput';
import { AuditlogsService } from 'src/app/business/API/system/logs/auditlogs.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { ModuleconfigService } from 'src/app/business/API/system/moduleconfig.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { ServicesService } from 'src/app/business/API/system/services.service';
import { UserService } from 'src/app/business/API/user/user.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { User } from 'src/app/business/co.com.jgs/security/user';
import { Auditlog } from 'src/app/business/co.com.jgs/system/auditlog';
import { Service } from 'src/app/business/co.com.jgs/system/service';
import { PasswordStatus } from 'src/app/business/co.com.jgs/utils/passwordStatus';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { MessageSeverity } from 'src/app/business/utils/messageserverity';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [MessageService]
})
export class DashboardComponent extends JGSComponent implements OnInit {

  login = true;
  showDlgChgPwd = false;
  passwordStatus : PasswordStatus;
  userOnline : User;
  changePasswordForm : FormGroup;
  errorMessages = {
    oldPassword:[
        {type:'required', message:'Campo requerido'}
    ],
    newPassword:[
        {type:'required', message:'Campo requerido'}
    ],
    confirmPassword:[
        {type:'required', message:'Campo requerido'}
    ]
  };
  onlineServices = 0;
  offlineServices = 0;
  allUser: User[]=[];
  openSessions = 0;
  services: Service[] = [];
  actualDate = new Date();
  auditlogs: Auditlog[]=[];
  inactiveServices: number;

  constructor(private userService : UserService,
              private formBuilder : FormBuilder,
              public mcService: ModuleconfigService,
              public servicesService: ServicesService,
              private breadcrumbService: BreadcrumbService,
              private auditLogService: AuditlogsService,
              private client : HttpClient,
              menulink:MenulinkService,
              messageService : MessageService,
              securityService: SecurityService) { 
                super(messageService, securityService, '/dashboard', menulink);
                this.breadcrumbService.setItems([
                  {label: 'Dashboard', routerLink: ['dashboard']}
              ]);
              }
  
  async ngOnInit(){
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:['', Validators.compose([
                    Validators.required
      ])],
      newPassword:['', Validators.compose([
                   Validators.required
      ])],
      confirmPassword:['', Validators.required]
    });
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    if(localStorage.getItem(LocalSecurity.username)){
      this.userOnline = await this.userService.getUser(this.message, localStorage.getItem(LocalSecurity.username));
      if(this.userOnline){
        this.passwordStatus = await this.userService.isExpiredPasswordUserOnline();
        this.showDlgChgPwd = this.passwordStatus.expired;
        this.allUser = await this.userService.getAllUsers(this.message);
        this.openSessions = await this.userService.getCountSession();
        this.services = await this.servicesService.findAllService(this.message);
        this.onlineServices = await this.countServices("online");
        this.offlineServices = await this.countServices("offline");
        this.inactiveServices = await this.countServices("inactivo");
        this.auditlogs = await this.auditLogService.getLogsByOperationDate(this.message, this.actualDate);
        if(this.passwordStatus.expired){
          this.putUIMessage(MessageSeverity.warn, "Alerta de seguridad", this.userOnline.username+" su contraseña ha expirado.");
        }
      }
    }
  }

  async changePassword(){
    if(this.changePasswordForm.get("newPassword").value === this.changePasswordForm.get("confirmPassword").value){
      this.showDlgChgPwd = ! await this.userService.changePassword(this. message, this.changePasswordForm.get("oldPassword").value, 
                                                         this.changePasswordForm.get("newPassword").value);
    }else{
      this.putUIMessage(MessageSeverity.error, "No se pudo completar la operacion", "La contraseña y su confirmacion no coinciden. Verifique e intente nuevamente")
    }
  }

  async minimunLenth(pwd : string){
    if(pwd){
      return pwd.length>=Number.parseInt((await this.mcService.getConfigurationByName(this.message, "PASSWORD_MIN_LENGTH")).value);
    }else{
      return false;
    }
  }

  async containsAlpah(pwd : string){

    if(pwd && (await this.mcService.getConfigurationByName(this.message, "PASSWORD_MIN_LENGTH")).value.toLowerCase() === 'true'){
      return pwd.match('.*([a-z])+.*$') && pwd.match('.*([0-9])+.*$');
    }else{
      return false;
    }
  }

  containsSpecial(pwd : string){
    if(pwd){
      return pwd.match('.*([:,;\'?!|\"#$%&/=\\.\\-\\_])+.*$')
    }else{
      return false;
    }
  }

  containsMayus(pwd : string){
    if(pwd){
      return pwd.match('.*([A-Z])+.*$')
    }else{
      return false;
    }
  }

  matchPwds(pwd : string, confirmPwd){
    if(pwd && confirmPwd){
      return pwd === confirmPwd;
    }else{
      return false;
    }
  }

  async countServices(status : string){
    var countService = 0;
    if(this.services){
      for(let service of this.services){
        if(status!=="inactivo"){
          if(service.active===1){
            let URLToInvoke = service.host+(service.port === ""?service.port:":"+service.port)+service.path+"info";
            try{
              let response = await this.client.get<JGSOutput>(URLToInvoke).toPromise();
              if(response.success && status === "online"){
                countService = countService + 1;
              }
            }catch(exception){
              if(status === "offline"){
                countService = countService + 1;
              }
            }
          } 
        }else{
          if(service.active!==1){
            countService = countService + 1;
          }
        }
      }
    }
    return countService;
  }

  getUserByStatus(status : number){
    if(status === 0){
      return this.allUser.length;
    }
    var countUser = 0;
    for(let user of this.allUser){
      if(user.userStatus.catalogsPK.itemId === status){
        countUser = countUser+1;
      }
    }
    return countUser;
  }

  countOperations(status : string){
    var countOperations = 0;
    for(let log of this.auditlogs){
      if(log.succesOperation === status){
        countOperations = countOperations + 1;
      }
    }
    return countOperations;
  }
}
