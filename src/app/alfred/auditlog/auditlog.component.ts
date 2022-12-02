import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuditlogsService } from 'src/app/business/API/system/logs/auditlogs.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Auditlog } from 'src/app/business/co.com.jgs/system/auditlog';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { DateUtil } from 'src/app/business/utils/date-util';

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html'
})
export class AuditlogComponent extends JGSComponent implements OnInit {

  auditlogs : Auditlog[]=[];
  auditlogForm : FormGroup;
  showDlgAuditlog = false;
  loadingTable = false;

  constructor(private auditlogService: AuditlogsService,
              private formBuilder : FormBuilder,
              private dateUtil : DateUtil,
              menulink:MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/auditlog', menulink);
     }

  async ngOnInit(){
    this.auditlogForm = this.formBuilder.group({
      date                : [new Date()],
      auditLogId          : [''],
      wsinvoked           : [''],
      methodInvoked       : [''],
      parametersInvoked   : [''],
      succesOperation     : [''],
      responseMessage     : [''],
      operationDate       : [''],
      username            : ['']
    });
    this.loadingTable = true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.auditlogs = await this.auditlogService.getLogsByOperationDate(this.message, this.auditlogForm.get("date").value);
    this.loadingTable = false;
  }

  async changeOperationDate(){
    this.auditlogs = await this.auditlogService.getLogsByOperationDate(this.message, this.auditlogForm.get("date").value);
  }

  viewOperation(auditlog : Auditlog){
    this.showDlgAuditlog = true;
    this.auditlogForm.get("auditLogId").setValue(auditlog.auditLogId);
    this.auditlogForm.get("wsinvoked").setValue(auditlog.wsinvoked);
    this.auditlogForm.get("methodInvoked").setValue(auditlog.methodInvoked);
    this.auditlogForm.get("parametersInvoked").setValue(auditlog.parametersInvoked);
    this.auditlogForm.get("succesOperation").setValue(auditlog.succesOperation);
    this.auditlogForm.get("responseMessage").setValue(auditlog.responseMessage);
    this.auditlogForm.get("operationDate").setValue(this.dateUtil.formatDate(auditlog.operationDate, "dd/MM/yyyy HH:mm:ss"));
    this.auditlogForm.get("username").setValue(auditlog.username?auditlog.username.username:"EJECUTADO POR EL SISTEMA.");
  }
}
