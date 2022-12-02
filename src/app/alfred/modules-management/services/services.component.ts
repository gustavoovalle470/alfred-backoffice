import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ModuleService } from 'src/app/business/API/subscription/module.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { ServicesService } from 'src/app/business/API/system/services.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Module } from 'src/app/business/co.com.jgs/subscription/module';
import { Service } from 'src/app/business/co.com.jgs/system/service';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html'
})
export class ServicesComponent extends JGSComponent implements OnInit {

  services : Service[]=[];
  modules : Module[]=[];
  showDlgService = false;
  loadingTable = false;
  newService = false;
  serviceForm: FormGroup;
  errorMessages = {
    serviceId:[
    ],
    serviceStatus:[
    ],
    name:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 200 caracteres'},
        {type:'pattern', message:'Nombre invalido.'}
    ],
    host:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 200 caracteres'},
      {type:'pattern', message:'Host invalido.'}
    ],
    port:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 10 caracteres'},
      {type:'pattern', message:'Puerto invalido.'}
    ],
    path:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 500 caracteres'},
      {type:'pattern', message:'Path invalido.'}
    ],
    description:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 500 caracteres'}
    ],
    moduleId:[
      {type:'required', message:'Campo requerido'}
    ]
  };

  constructor(private serviceService : ServicesService,
              private moduleService : ModuleService,
              private formBuilder : FormBuilder,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/modules/services', menulink);
     }

  async ngOnInit(){
    this.serviceForm = this.formBuilder.group({
      serviceId:[{value : '', disabled : true}],
      serviceStatus:[],
      name:['', Validators.compose([
                Validators.required,
                Validators.maxLength(300),
                Validators.pattern('^[A-z a-z 0-9]+$')
      ])],
      host:['', Validators.compose([
                Validators.required,
                Validators.maxLength(200),
                Validators.pattern('^[A-za-z0-9:/\\.]+$')
      ])],
      port:['', Validators.compose([
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern('^[0-9]+$')
      ])],
      path:['', Validators.compose([
                Validators.required,
                Validators.maxLength(500),
                Validators.pattern('^/[A-za-z0-9/\\.]+$')
      ])],
      description:['', Validators.compose([
                       Validators.required,
                       Validators.maxLength(500)
      ])],
      moduleId:['', Validators.required]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.services = await this.serviceService.findAllService(this.message);
    this.modules = await this.moduleService.getAllModules(this.message);
    this.loadingTable=false;
  }

  createService(){
    this.serviceForm.reset();
    this.showDlgService = true;
    this.newService = true;
    this.loadingTable = true;
  }

  editService(service : Service){
    this.showDlgService = true;
    this.newService = false;
    this.loadingTable = true;
    this.serviceForm.get("serviceId").setValue(service.id);
    this.serviceForm.get("serviceStatus").setValue(service.active);
    this.serviceForm.get("name").setValue(service.name);
    this.serviceForm.get("host").setValue(service.host);
    this.serviceForm.get("port").setValue(service.port);
    this.serviceForm.get("path").setValue(service.path);
    this.serviceForm.get("description").setValue(service.description);
    this.serviceForm.get("moduleId").setValue(service.moduleId.moduleId);
  }

  async saveService(){
    if(this.newService){
      this.showDlgService = ! await this.serviceService.registerService(this.message, {
        name : this.serviceForm.get("name").value,
        description : this.serviceForm.get("description").value,
        host : this.serviceForm.get("host").value,
        port : this.serviceForm.get("port").value,
        path : this.serviceForm.get("path").value,
        moduleId : this.serviceForm.get("moduleId").value 
      });
    }else{
      this.showDlgService = ! await this.serviceService.updateService(this.message, {
        serviceId : this.serviceForm.get("serviceId").value,
        serviceStatus: this.serviceForm.get("serviceStatus").value?1:0,
        name : this.serviceForm.get("name").value,
        description : this.serviceForm.get("description").value,
        host : this.serviceForm.get("host").value,
        port : this.serviceForm.get("port").value,
        path : this.serviceForm.get("path").value,
        moduleId : this.serviceForm.get("moduleId").value 
      });
    }
    this.services = await this.serviceService.findAllService(this.message);
    this.loadingTable=false;
  }
}
