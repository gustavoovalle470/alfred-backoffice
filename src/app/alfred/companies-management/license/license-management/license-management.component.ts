import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Module} from 'src/app/business/co.com.jgs/subscription/module';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/alfred/breadcrumb/app.breadcrumb.service';
import { CompanyService } from 'src/app/business/API/subscription/company.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LicenseService } from 'src/app/business/API/user/license.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Company } from 'src/app/business/co.com.jgs/subscription/company';
import { License } from 'src/app/business/co.com.jgs/subscription/license';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { DateUtil } from 'src/app/business/utils/date-util';
import { ModuleService } from 'src/app/business/API/subscription/module.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';

@Component({
  selector: 'app-license-management',
  templateUrl: './license-management.component.html'
})
export class LicenseManagementComponent extends JGSComponent implements OnInit {

  companies : Company[]=[];
  licenseForCompany : License[]=[];
  allModule : Module[]=[];
  modulesOutOfLicense : Module[]=[];
  selectedModules : Module[]=[]
  formSelectLicenses : FormGroup;
  licensesForm : FormGroup;
  moduleForm : FormGroup;
  loadingTable = false;
  preLoadCompany=false;
  showDlgLicense=false;
  showDlgAddModule = false;
  newLicense = false;
  selectedCompany=false;
  expandedRows = {};
  isExpanded: boolean = false;
  errorMessages = {
    daysOfValidity:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Duración invalida'},
        {type:'maxlength', message:'Maximo 6 numeros'}
    ],
    autoRenoval:[
        {type:'required', message:'Campo requerido'}
    ],
    startDate:[
      {type:'required', message:'Campo requerido'}
    ]
  };

  constructor(private breadcrumbService: BreadcrumbService,
              private companyService : CompanyService,
              private licenseService : LicenseService,
              private moduleService : ModuleService,
              private formBuilder : FormBuilder,
              private dateUtil : DateUtil,
              menulink: MenulinkService,
              messageService : MessageService,
              securityService: SecurityService) { 
                super(messageService, securityService, '/alfred/companies/licenses', menulink);
                this.breadcrumbService.setItems([
                  {label: 'Empresas', routerLink: ['companies']},
                  {label: 'Licencias', routerLink: ['companies/licenses']}
                ]);
  }

  async ngOnInit(){
    this.moduleForm = this.formBuilder.group({
      modules : [],
      licenseToAdd : []
    });
    this.formSelectLicenses = this.formBuilder.group({
      company : []
    });
    this.licensesForm = this.formBuilder.group({
      licenseId : [],
      daysOfValidity :['', Validators.compose([
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern('^[0-9]+$')
      ])],
      autoRenoval : [Validators.required],
      startDate : [{value: new Date(), disabled:true}, Validators.required],
      finishDate : [{value: new Date(), disabled:true}]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.companies = await this.companyService.getAllCompanies(this.message);
    this.allModule = await this.moduleService.getAllModules(this.message);
    if(localStorage.getItem("companyToLicense")){
      this.formSelectLicenses.get("company").setValue(this.getCompanyByName(localStorage.getItem("companyToLicense")).companyId);
      await this.putLicensesForCompany();
      localStorage.removeItem("companyToLicense");
      this.preLoadCompany = true;
    }
    this.loadingTable=false;
  }

  async putLicensesForCompany() {
    this.loadingTable = true;
    var company = this.getCompany();
    if(company){
      this.selectedCompany = true;
      this.licenseForCompany = await this.licenseService.getLicenseByCompany(this.message, company.companyId);
    }
    this.loadingTable = false;
  }

  getCompany() : Company{
    for(let company of this.companies){
      if(company.companyId === this.formSelectLicenses.get("company").value){
        return company;
      }
    }
    return null;
  }

  getCompanyByName(name : string) : Company{
    for(let company of this.companies){
      if(company.name === name){
        return company;
      }
    }
    return null;
  }

  getFinalDate(license : License){
    var finalDate = new Date(license.start);
    finalDate.setDate(finalDate.getDate()+license.daysOfValidity);
    return finalDate;
  }

  getLeftDays(license : License){
    var lapseDays = this.dateUtil.daysBetweenToDates(new Date(license.start), new Date());
    return license.daysOfValidity - lapseDays;
  }

  calculateFinishDate(){
    try{
      var days = Number.parseInt(this.licensesForm.get("daysOfValidity").value);
      var finishDate = new Date();
      finishDate.setDate(finishDate.getDate()+days);
      this.licensesForm.get("finishDate").setValue(finishDate);
    }catch(exception){
      this.licensesForm.get("finishDate").setValue(new Date());
    }
  }

  createLicense(){
    this.showDlgLicense = true;
    this.newLicense = true;
    this.loadingTable = true;
    this.licensesForm.reset();
  }

  editLicense(license: License){
    this.showDlgLicense = true;
    this.newLicense = false;
    this.loadingTable = true;
    this.licensesForm.get("licenseId").setValue(license.id);
    this.licensesForm.get("daysOfValidity").setValue(license.daysOfValidity);
    this.licensesForm.get("autoRenoval").setValue(license.autoRenoval===1?true:false);
    this.licensesForm.get("startDate").setValue(new Date(license.start));
    this.calculateFinishDate();
  }

  async saveLicense(){
    if(this.newLicense){
      this.showDlgLicense = ! await this.licenseService.registerNewLicense(this.message, {
        companyId : this.formSelectLicenses.get("company").value,
        autoRenoval : this.licensesForm.get("autoRenoval").value?1:0,
        daysOfValidity : this.licensesForm.get("daysOfValidity").value,
      });
    }else{
      this.showDlgLicense = ! await this.licenseService.updateLicense(this.message, {
        licenseIdToUpdate : this.licensesForm.get("licenseId").value,
        companyId : this.formSelectLicenses.get("company").value,
        autoRenoval : this.licensesForm.get("autoRenoval").value?1:0,
        daysOfValidity : this.licensesForm.get("daysOfValidity").value,
        startDate : this.licensesForm.get("startDate").value
      })
    }
    this.putLicensesForCompany();
    this.loadingTable = false;
  }

  async deleteModule(license: License, module : Module){
    await this.licenseService.addModuleToLicense(this.message, {
      licenseToUpdateId : license.id,
      moduleId: module.moduleId,
      operation : "remove"
    });
    this.putLicensesForCompany();
  }

  addModuleToLicense(license: License){
    this.moduleForm.reset();
    this.modulesOutOfLicense=[];
    this.selectedModules = [];
    this.moduleForm.get("licenseToAdd").setValue(license.id);
    for(let module of this.allModule){
      if(this.moduleNotInLicense(license, module)){
        this.modulesOutOfLicense.push(module);
      }
    }
    this.showDlgAddModule = true;
  }

  moduleNotInLicense(license: License, module : Module) {
    for(let moduleInLicense of license.modules){
      if(moduleInLicense.moduleId === module.moduleId){
        return false;
      }
    }
    return true;
  }

  async saveModuleInLicense(){
    for(let module of this.moduleForm.get("modules").value){
      await this.licenseService.addModuleToLicense(this.message, {
        licenseToUpdateId : this.moduleForm.get("licenseToAdd").value,
        moduleId: module.moduleId,
        operation : "add"
      });
    }
    this.putLicensesForCompany();
    this.showDlgAddModule = false;
  }
}
