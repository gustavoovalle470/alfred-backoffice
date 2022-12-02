import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { OperationService } from 'src/app/business/API/system/operation.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { ServicesService } from 'src/app/business/API/system/services.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Operation } from 'src/app/business/co.com.jgs/system/operation';
import { Service } from 'src/app/business/co.com.jgs/system/service';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html'
})
export class OperationsComponent extends JGSComponent implements OnInit {

  operations : Operation[]=[];
  services : Service[]=[];
  showDlgOperation = false;
  loadingTable = false;
  newOperation = false;
  operationForm : FormGroup;
  errorMessages = {
    operationId:[
    ],
    serviceId:[
      {type:'required', message:'Campo requerido'}
    ],
    name:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 300 caracteres'},
        {type:'pattern', message:'Nombre invalido.'}
    ],
    description:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 500 caracteres'},
    ],
    controller:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 200 caracteres'},
      {type:'pattern', message:'Controlador invalido.'}
    ],
    version:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 45 caracteres'},
      {type:'pattern', message:'Version invalida.'}
    ],
    operation:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 200 caracteres'},
      {type:'pattern', message:'Operacion invalida.'}
    ],
    status:[
    ],
    auditable:[
    ]
  };  

  constructor(private operationService : OperationService,
              private serviceService : ServicesService,
              private formBuilder : FormBuilder,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/modules/operations', menulink);
     }

  async ngOnInit(){
    this.operationForm = this.formBuilder.group({
      operationId:[{value : '', disabled : true}],
      serviceId:['', Validators.required],
      name:['', Validators.compose([
                Validators.required,
                Validators.maxLength(300),
                Validators.pattern('^[A-z a-z 0-9]+$')
      ])],
      description:['',  Validators.compose([
                        Validators.required,
                        Validators.maxLength(500)
      ])],
      controller:['', Validators.compose([
                      Validators.required,
                      Validators.maxLength(200),
                      Validators.pattern('^[A-za-z\\-/]+$')
      ])],
      version:['', Validators.compose([
                   Validators.required,
                   Validators.maxLength(42),
                   Validators.pattern('^[a-z0-9]+$')
      ])],
      operation:['', Validators.compose([
                     Validators.required,
                     Validators.maxLength(200),
                     Validators.pattern('^[A-za-z0-9\\-]+$')
      ])],
      status:[],
      auditable:[]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.operations = await this.operationService.findAllOperations(this.message);
    this.services = await this.serviceService.findAllService(this.message);
    this.loadingTable=false;
  }

  createOperation(){
    this.operationForm.reset();
    this.showDlgOperation = true;
    this.newOperation = true;
    this.loadingTable = true;
    this.operationForm.get("serviceId").enable();
  }

  editOperation(operation:Operation){
    this.showDlgOperation = true;
    this.newOperation = false;
    this.loadingTable = true;
    this.operationForm.get("serviceId").disable();
    this.operationForm.get("operationId").setValue(operation.operationsPK.id);
    this.operationForm.get("serviceId").setValue(operation.operationsPK.serviceId);
    this.operationForm.get("name").setValue(operation.name);
    this.operationForm.get("description").setValue(operation.desciption);
    this.operationForm.get("controller").setValue(operation.controller);
    this.operationForm.get("version").setValue(operation.version);
    this.operationForm.get("operation").setValue(operation.operation);
    this.operationForm.get("status").setValue(operation.active);
    this.operationForm.get("auditable").setValue(operation.auditable);
  }

  async saveOperation(){
    if(this.newOperation){
      this.showDlgOperation = ! await this.operationService.registerOperation(this.message, {
        serviceId : this.operationForm.get("serviceId").value,
        name : this.operationForm.get("name").value,
        description : this.operationForm.get("description").value,
        controller : this.operationForm.get("controller").value,
        version : this.operationForm.get("version").value,
        operation : this.operationForm.get("operation").value,
        status : this.operationForm.get("status").value?1:0,
        auditable : this.operationForm.get("auditable").value?1:0
      });
    }else{
      this.showDlgOperation = ! await this.operationService.updateOperation(this.message, {
        operationId : this.operationForm.get("operationId").value,
        serviceId : this.operationForm.get("serviceId").value,
        name : this.operationForm.get("name").value,
        description : this.operationForm.get("description").value,
        controller : this.operationForm.get("controller").value,
        version : this.operationForm.get("version").value,
        operation : this.operationForm.get("operation").value,
        status : this.operationForm.get("status").value?1:0,
        auditable : this.operationForm.get("auditable").value?1:0});
    }
    this.operations = await this.operationService.findAllOperations(this.message);
    this.loadingTable=false;
  }
}
