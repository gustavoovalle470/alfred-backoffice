import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/business/API/subscription/company.service';
import { CatalogService } from 'src/app/business/API/system/catalog.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { UserService } from 'src/app/business/API/user/user.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { User } from 'src/app/business/co.com.jgs/security/user';
import { UserData } from 'src/app/business/co.com.jgs/security/user-data';
import { Company } from 'src/app/business/co.com.jgs/subscription/company';
import { Catalog } from 'src/app/business/co.com.jgs/system/catalog';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { MessageSeverity } from 'src/app/business/utils/messageserverity';
import { BreadcrumbService } from '../breadcrumb/app.breadcrumb.service';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html'
})
export class UsersManagementComponent extends JGSComponent implements OnInit {

  showDlgUser = false;
  loadingTable = false;
  newUser = false;
  users : User[]=[];
  userDataSelected : UserData;
  companies : Company[]=[];
  idTypes : Catalog[]=[];
  genders : Catalog[]=[];
  userStatus : Catalog[]=[];
  userForm : FormGroup;
  errorMessages = {
    name:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 100 caracteres'},
      {type:'pattern', message:'Nombre invalido'}
    ],
    surname:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 100 caracteres'},
      {type:'pattern', message:'Nombre de modulo invalido'}
    ],
    idType:[
        {type:'required', message:'Campo requerido'}
    ],
    document:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 45 digitos'},
      {type:'pattern', message:'Identificacion invalida. Solo se permiten letras y números'}
    ],
    gender:[
      {type:'required', message:'Campo requerido'}
    ],
    email:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 250 caracteres'},
      {type:'pattern', message:'Correo electrónico invalido'}
    ],
    phone:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 10 digitos'},
      {type:'pattern', message:'Telefono invalido'}
    ],
    address:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 250 caracteres'}
    ],
    userStatus:[
      {type:'required', message:'Campo requerido'}
    ],
    company:[
      {type:'required', message:'Campo requerido'}
    ]
  };

  constructor(private breadcrumbService: BreadcrumbService,
              private userService : UserService,
              private companyService: CompanyService,
              private catalogService: CatalogService,
              private formBuilder : FormBuilder,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService: SecurityService) { 
      super(messageService, securityService, '/alfred/users', menulink);
      this.breadcrumbService.setItems([
        {label: 'Usuarios', routerLink: ['users']}
      ]);
  }

  async ngOnInit() {
    this.userForm = this.formBuilder.group({
      username : [{value : '', disabled : true}],
      name : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern('^[A-Za-z ]+$')
      ])],
      surname : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern('^[A-Za-z ]+$')
      ])],
      idType : ['', Validators.required],
      document : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(45),
        Validators.pattern('^[A-Za-z0-9]+$')
      ])],
      gender : ['', Validators.required],
      email : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(230),
        Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
      ])],
      phone : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^[0-9]+$')
      ])],
      address : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(250)
      ])],
      userStatus : ['', Validators.required],
      company : ['', Validators.required],
      userSessionStatus:['', Validators.required]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.users = await this.userService.getAllUsers(this.message);
    this.companies = await this.companyService.getAllCompanies(this.message);
    this.idTypes = await this.catalogService.getCatalog(this.message, 2);
    this.genders = await this.catalogService.getCatalog(this.message, 3);
    this.userStatus = await this.catalogService.getCatalog(this.message, 1);
    this.loadingTable=false;
  }

  createUser(){
    this.userForm.reset();
    this.userForm.get("userSessionStatus").disable();
    this.showDlgUser = true;
    this.loadingTable = true;
    this.newUser = true;
  }

  async editUser(user : User){
    this.createUser();
    this.newUser = false;
    this.userDataSelected = await this.userService.getUserData(this.message, user.username);
    this.userForm.get("username").setValue(user.username);
    this.userForm.get("name").setValue(this.userDataSelected.name);
    this.userForm.get("surname").setValue(this.userDataSelected.surname);
    this.userForm.get("idType").setValue(this.userDataSelected.documentType.catalogsPK.itemId);
    this.userForm.get("document").setValue(this.userDataSelected.document);
    this.userForm.get("gender").setValue(this.userDataSelected.gender.catalogsPK.itemId);
    this.userForm.get("email").setValue(this.userDataSelected.email);
    this.userForm.get("phone").setValue(this.userDataSelected.phone);
    this.userForm.get("address").setValue(this.userDataSelected.address);
    this.userForm.get("userStatus").setValue(user.userStatus.catalogsPK.itemId);
    this.userForm.get("company").setValue(user.companyId.companyId);
    if(await this.userService.isUserOnline(user.username)){
      this.userForm.get("userSessionStatus").enable();
      this.userForm.get("userSessionStatus").setValue(1);
    }else{
      this.userForm.get("userSessionStatus").disable();
      this.userForm.get("userSessionStatus").setValue(0);
    }
  }

  async saveUser(){
    if(this.newUser){
      this.showDlgUser = ! await this.userService.registerNewUser(this.message,
      {
        name:this.userForm.get("name").value,
        surname:this.userForm.get("surname").value,
        gender : this.userForm.get("gender").value,
        idType: this.userForm.get("idType").value,
        document: this.userForm.get("document").value,
        email: this.userForm.get("email").value,
        address: this.userForm.get("address").value,
        phone: this.userForm.get("phone").value,
        userType: this.userForm.get("userStatus").value,
        companyId: this.userForm.get("company").value
      });
    }else{
      this.showDlgUser = ! await this.userService.saveUserData(this.message,
      {
        usernameToUpdate: this.userForm.get("username").value,
        name: this.userForm.get("name").value,
        surname: this.userForm.get("surname").value,
        gender : this.userForm.get("gender").value,
        idType: this.userForm.get("idType").value,
        document:this.userForm.get("document").value,
        address: this.userForm.get("address").value,
        phone: this.userForm.get("phone").value,
        userStatus: this.userForm.get("userStatus").value,
        companyId: this.userForm.get("company").value
      });
    }
    this.users = await this.userService.getAllUsers(this.message);
    this.loadingTable = false;
  }

  async doUserLogout(){
    if(this.userForm.get("username").value !== localStorage.getItem(LocalSecurity.username)){
      //this.showDlgUser = ! await this.security.doUserLogout(this.message, this.userForm.get("username").value);
      this.putUIMessage(MessageSeverity.warn, "No se puede realizar la operación", "Esta funcion aun no se encuentra implementada.")
      this.users = await this.userService.getAllUsers(this.message);
      this.userForm.get("userSessionStatus").setValue(1);
    }else{
      this.userForm.get("userSessionStatus").setValue(1);
      this.putUIMessage(MessageSeverity.warn, "No se puede realizar la operación", "No puede cerrar la sesión de su usuario por este medio.")
    }
  }
}
