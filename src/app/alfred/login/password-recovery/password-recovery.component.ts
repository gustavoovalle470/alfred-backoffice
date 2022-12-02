import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CatalogService } from 'src/app/business/API/system/catalog.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { UserService } from 'src/app/business/API/user/user.service';
import { Catalog } from 'src/app/business/co.com.jgs/system/catalog';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  providers: [MessageService]
})
export class PasswordRecoveryComponent extends JGSComponent implements OnInit {

  recoveryForm: FormGroup;
  idTypes: Catalog[] = [];
  showDlgState = false;

  errorMessages = {
    idType:[
      {type:'required', message:'Campo requerido'}
    ],
    document:[
      {type:'required', message:'Campo requerido'},
      {type:'pattern', message:'Documento inválido'},
      {type:'maxLength', message:'Se permiten máximo 10 carácteres'}
    ],
    username:[
      {type:'required', message:'Campo requerido'},
      {type:'pattern', message:'Usuario inválido'},
      {type:'maxLength', message:'Se permiten máximo 40 carácteres'}
    ],
    email:[
      {type:'required', message:'Campo requerido'},
      {type:'pattern', message:'Correo inválido'},
      {type:'maxLength', message:'Se permiten máximo 250 carácteres'}
    ]
  }

  constructor(messageService: MessageService, 
              securityService: SecurityService, 
              private formBuilder: FormBuilder, 
              private catalogService: CatalogService, 
              private userService: UserService,
              private routerlink: Router,
              menulink: MenulinkService) {
    super(messageService, securityService, "/dashBoard", menulink) 
  }

  async ngOnInit() {
    this.recoveryForm = this.formBuilder.group({
      idType: ['', Validators.required],
      document: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z0-9]+$'),
        Validators.maxLength(10)
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-z0-9]+$'),
        Validators.maxLength(40)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'),
        Validators.maxLength(230)
      ])]
    });

    this.idTypes = await this.catalogService.getCatalog(this.message, 2);
  }

  async passwordRecovery(){
    if (await this.userService.doRecoverPasswrod(this.message, {
      idType: this.recoveryForm.get("idType").value,
      document: this.recoveryForm.get("document").value,
      email: this.recoveryForm.get("email").value,
      usernameToUpdate: this.recoveryForm.get("username").value
    })){
      this.recoveryForm.reset();
      this.routerlink.navigate(["/"]);
    }
  }
}
