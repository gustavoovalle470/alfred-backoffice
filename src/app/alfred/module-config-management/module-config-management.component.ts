import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { ModuleconfigService } from 'src/app/business/API/system/moduleconfig.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Menulink } from 'src/app/business/co.com.jgs/security/menulink';
import { ModuleConfiguration } from 'src/app/business/co.com.jgs/system/module-configuration';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { BreadcrumbService } from '../breadcrumb/app.breadcrumb.service';

@Component({
  selector: 'app-module-config-management',
  templateUrl: './module-config-management.component.html'
})
export class ModuleConfigManagementComponent extends JGSComponent implements OnInit {

  moduleConfigs : ModuleConfiguration[]=[];
  allowConfigTypes = [{id: "BOOLEAN"}, {id: "DOUBLE"}, {id: "INTEGER"}, {id: "LONG"},  {id: "STRING"}]
  showDlgConfigs = false;
  newConfig = true;
  loadingTable = false;
  moduleConfigForm : FormGroup;
  errorMessages = {
    moduleConfigurationId:[
    ],
    name:[
        {type:'required', message:'Campo requerido'},
        {type:'maxLength', message:'Maximo 99 caracteres'},
        {type:'pattern', message:'Nombre no valido.'}
    ],
    type:[
        {type:'required', message:'Campo requerido'},
        {type:'maxLength', message:'Maximo 45 caracteres'},
        {type:'pattern', message:'Tipo no valido.'}
    ],
    value:[
      {type:'required', message:'Campo requerido'},
        {type:'maxLength', message:'Maximo 2500 caracteres'},
    ],
    module:[
      {type:'required', message:'Campo requerido'},
      {type:'maxLength', message:'Maximo 100 caracteres'},
      {type:'pattern', message:'Modulo no valido'}
    ]
  };

  constructor(private breadcrumbService: BreadcrumbService,
              private ModuleConfigsService : ModuleconfigService,
              private formBuilder : FormBuilder,
              menulink: MenulinkService, 
              messageService : MessageService,
              securityService: SecurityService) { 
    super(messageService, securityService, '/alfred/configurations', menulink);
    this.breadcrumbService.setItems([
            {label: 'Configuracion sistema', routerLink: ['configurations']}
    ]);
  }

  async ngOnInit() {
    this.moduleConfigForm = this.formBuilder.group({
      moduleConfigurationId : [{value: '', disabled:true}],
      name : ['', Validators.compose([
                  Validators.required,
                  Validators.maxLength(99),
                  Validators.pattern('^[A-Za-z0-9\\_]+$')
      ])],
      type :['', Validators.compose([
                 Validators.required,
                 Validators.maxLength(45),
                 Validators.pattern('^[A-Za-z\\_]+$')
      ])],
      value : ['', Validators.compose([
                   Validators.required,
                   Validators.maxLength(2500)
      ])],
      module : ['', Validators.compose([
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[A-Za-z\\_]+$')
      ])]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.moduleConfigs = await this.ModuleConfigsService.getaAllConfigurations(this.message);
    this.loadingTable=false;
  }

  editConfiguration(mconfiguration : ModuleConfiguration){
    this.newConfig = false;
    this.showDlgConfigs = true;
    this.moduleConfigForm.get("moduleConfigurationId").setValue(mconfiguration.moduleConfigurationId);
    this.moduleConfigForm.get("name").setValue(mconfiguration.name);
    this.moduleConfigForm.get("type").setValue(mconfiguration.type);
    this.moduleConfigForm.get("value").setValue(mconfiguration.value);
    this.moduleConfigForm.get("module").setValue(mconfiguration.module);
  }

  createConfiguration(){
    this.moduleConfigForm.reset();
    this.newConfig = true;
    this.showDlgConfigs = true;
  }

  async saveConfiguration(){
    this.loadingTable = true;
    if(this.validateValueAndType()){
      if(this.newConfig){
        this.showDlgConfigs = ! await this.ModuleConfigsService.registerNewConfiguration(this.message,
          {
            name : this.moduleConfigForm.get("name").value,
            type : this.moduleConfigForm.get("type").value,
            value: this.moduleConfigForm.get("value").value,
            module: this.moduleConfigForm.get("module").value
          });
      }else{
        this.showDlgConfigs = ! await this.ModuleConfigsService.updateConfiguration(this.message,
          {
            moduleConfigurationId : this.moduleConfigForm.get("moduleConfigurationId").value,
            name : this.moduleConfigForm.get("name").value,
            type : this.moduleConfigForm.get("type").value,
            value: this.moduleConfigForm.get("value").value,
            module: this.moduleConfigForm.get("module").value
          });
      }
      this.moduleConfigs = await this.ModuleConfigsService.getaAllConfigurations(this.message);
      this.loadingTable=false;
    }
  }

  validateValueAndType() : boolean {
    let value : string = this.moduleConfigForm.get("value").value;
    value = value.toLowerCase();
    if(this.moduleConfigForm.get("type").value === "BOOLEAN"){
      return (value === "true" || value === "false")
    }else if(this.moduleConfigForm.get("type").value === "INTEGER" || 
             this.moduleConfigForm.get("type").value === "LONG"){
      try{
        
        return true
      }catch(exception){
        return false;
      } finally{
        return true;
      }
    }else if(this.moduleConfigForm.get("type").value === "DOUBLE"){
      try{
        Number.parseFloat(value);
      }catch(exception){
        return false;
      } finally{
        return true;
      }
    }else{
      return true;
    }
  }

  changeValueValidator(){
    this.moduleConfigForm.get("value").clearValidators();
    this.moduleConfigForm.get("value").addValidators( Validators.compose([
                                                      Validators.required,
                                                      Validators.maxLength(2500),
                                                      Validators.pattern(this.getPattern())
                                                    ]));
  }

  getPattern(): string | RegExp {
    if(this.moduleConfigForm.get("type").value === "BOOLEAN"){
      return '(true|false|TRUE|FALSE)';
    }else if(this.moduleConfigForm.get("type").value === "INTEGER" || 
             this.moduleConfigForm.get("type").value === "LONG"){
      return '^[0-9]+$';
    }else if(this.moduleConfigForm.get("type").value === "DOUBLE"){
      return '^[0-9\\.]+$';
    }else{
      return '';
    }
    
  }

}

