import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ModuleService } from 'src/app/business/API/subscription/module.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Module } from 'src/app/business/co.com.jgs/subscription/module';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { BreadcrumbService } from '../breadcrumb/app.breadcrumb.service';

@Component({
  selector: 'app-modules-management',
  templateUrl: './modules-management.component.html'
})
export class ModulesManagementComponent extends JGSComponent implements OnInit {

  modules : Module[]=[];
  showDlgModule = false;
  newModule = false;
  loadingTable = false;
  moduleForm : FormGroup;
  errorMessages = {
    moduleId:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 45 caracteres'},
      {type:'pattern', message:'Id de modulo invalido'}
    ],
    name:[
        {type:'required', message:'Campo requerido'},
        {type:'maxLength', message:'Maximo 100 caracteres'},
        {type:'pattern', message:'Nombre de modulo invalido'}
    ],
    descripcion:[
        {type:'required', message:'Campo requerido'},
        {type:'maxLength', message:'Maximo 45 caracteres'}
    ],
    moduleStatus:[
      {type:'required', message:'Campo requerido'}
    ]
  };

  constructor(private breadcrumbService: BreadcrumbService,
              private formBuilder : FormBuilder,
              private moduleService : ModuleService,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService: SecurityService) { 
    super(messageService, securityService, '/alfred/modules', menulink);
    this.breadcrumbService.setItems([
      {label: 'Modulos', routerLink: ['modules']}
    ]);
  }

  async ngOnInit() {
    this.moduleForm = this.formBuilder.group({
      moduleId : ['', Validators.compose([
                  Validators.required,
                  Validators.maxLength(45),
                  Validators.pattern('^[A-Za-z0-9\\_]+$')
      ])],
      name :['', Validators.compose([
                 Validators.required,
                 Validators.maxLength(100),
                 Validators.pattern('^[A-Za-z ]+$')
      ])],
      descripcion : ['', Validators.compose([
                   Validators.required,
                   Validators.maxLength(250)
      ])],
      moduleStatus : ['', Validators.required]
    });
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.loadingTable = true;
    this.modules = await this.moduleService.getAllModules(this.message);
    this.loadingTable = false;
  }

  createModule(){
    this.loadingTable = true;
    this.moduleForm.reset();
    this.showDlgModule = true;
    this.newModule = true;
  }

  editModule(module : Module){
    this.loadingTable = true;
    this.moduleForm.reset();
    this.showDlgModule = true;
    this.newModule = false;
    this.moduleForm.get("moduleId").setValue(module.moduleId);
    this.moduleForm.get("name").setValue(module.name);
    this.moduleForm.get("descripcion").setValue(module.descripcion);
    this.moduleForm.get("moduleStatus").setValue(module.active);
  }

  async saveModule(){
    if(this.newModule){
      this.showDlgModule = ! await this.moduleService.registryModule(this.message, {
        moduleId : this.moduleForm.get("moduleId").value,
        name:  this.moduleForm.get("name").value,
        description: this.moduleForm.get("descripcion").value
      });
    }else{
      this.showDlgModule = ! await this.moduleService.updateModule(this.message, {
        moduleId : this.moduleForm.get("moduleId").value,
        name:  this.moduleForm.get("name").value,
        description: this.moduleForm.get("descripcion").value,
        moduleStatus : this.moduleForm.get("moduleStatus").value?1:0
      });
    }
    this.modules = await this.moduleService.getAllModules(this.message);
    this.loadingTable = false;
  }
}
