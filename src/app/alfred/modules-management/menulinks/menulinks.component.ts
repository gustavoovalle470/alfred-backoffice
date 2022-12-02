import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenulinkInput } from 'src/app/business/API/model/inputs/system/menulink-input';
import { ModuleService } from 'src/app/business/API/subscription/module.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Menulink } from 'src/app/business/co.com.jgs/security/menulink';
import { Module } from 'src/app/business/co.com.jgs/subscription/module';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { menuNodes } from 'src/environments/environment';

@Component({
  selector: 'app-menulinks',
  templateUrl: './menulinks.component.html'
})
export class MenulinksComponent extends JGSComponent implements OnInit {

  menulinks : Menulink[]=[];
  modules : Module[]=[];
  nodes = menuNodes;
  showDlgMenulink = false;
  loadingTable = false;
  newMenulink = false;
  menulinkForm: FormGroup;
  errorMessages = {
    menuName:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 250 caracteres'},
        {type:'pattern', message:'Nombre de menu invalido.'}
    ],
    module:[
      {type:'required', message:'Campo requerido'}
    ],
    node:[
        {type:'required', message:'Campo requerido'}
    ],
    status:[
    ],
    link:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 500 caracteres'},
      {type:'pattern', message:'Link de menu invalido.'}
    ],
    iconExpression:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 250 caracteres'},
      {type:'pattern', message:'Expresion de incono invalida.'}
    ]
  };

  constructor(private moduleService : ModuleService,
              private formBuilder : FormBuilder,
              menulink: MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/modules/menulinks', menulink);
     }

  async ngOnInit(){
    this.menulinkForm = this.formBuilder.group({
      menuName:['', Validators.compose([
                     Validators.required,
                     Validators.maxLength(250),
                     Validators.pattern('^[A-za-z 0-9]+$')
      ])],
      module:['', Validators.required],
      node:['', Validators.required],
      status:[],
      link:['', Validators.compose([
                Validators.required,
                Validators.maxLength(500),
                Validators.pattern('^/[A-za-z0-9/]+$')
      ])],
      iconExpression:['', Validators.compose([
                          Validators.required,
                          Validators.maxLength(250),
                          Validators.pattern('^[A-za-z0-9 \\-]+$')
      ])]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.menulinks = await this.menulinkService.getAllMenuLinks(this.message);
    this.modules = await this.moduleService.getAllModules(this.message);
    this.loadingTable=false;
  }

  createMenulink(){
    this.menulinkForm.reset();
    this.showDlgMenulink = true;
    this.loadingTable = true;
    this.newMenulink = true;
  }

  editMenulink(menulink : Menulink){
    this.showDlgMenulink = true;
    this.loadingTable = true;
    this.newMenulink = false;
    this.menulinkForm.get("menuName").setValue(menulink.menuName);
    this.menulinkForm.get("module").setValue(menulink.module.moduleId);
    this.menulinkForm.get("node").setValue(menulink.node);
    this.menulinkForm.get("status").setValue(menulink.status);
    this.menulinkForm.get("link").setValue(menulink.link);
    this.menulinkForm.get("iconExpression").setValue(menulink.iconExpression);
  }

  async saveMenulink(){
    let data : MenulinkInput ={
      menuName : this.menulinkForm.get("menuName").value,
      module   : this.menulinkForm.get("module").value,
      node     : this.menulinkForm.get("node").value,
      status   : this.menulinkForm.get("status").value?1:0,
      link     : this.menulinkForm.get("link").value,
      iconExpression : this.menulinkForm.get("iconExpression").value
    }
    if(this.newMenulink){
      this.showDlgMenulink = ! await this.menulinkService.registryMenulink(this.message, data);
      console.log(this.showDlgMenulink);
    }else{
      this.showDlgMenulink = ! await this.menulinkService.updateMenulink(this.message, data);
      console.log(this.showDlgMenulink);
    }
    this.menulinks = await this.menulinkService.getAllMenuLinks(this.message);
    this.loadingTable = false;
  }
  
}
