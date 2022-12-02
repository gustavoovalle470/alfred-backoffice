import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/business/API/subscription/company.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { CityService } from 'src/app/business/API/utils/city.service';
import { CountryService } from 'src/app/business/API/utils/country.service';
import { StateService } from 'src/app/business/API/utils/state.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Company } from 'src/app/business/co.com.jgs/subscription/company';
import { City } from 'src/app/business/co.com.jgs/utils/city';
import { Country } from 'src/app/business/co.com.jgs/utils/country';
import { State } from 'src/app/business/co.com.jgs/utils/state';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { BreadcrumbService } from '../breadcrumb/app.breadcrumb.service';

@Component({
  selector: 'app-companies-management',
  templateUrl: './companies-management.component.html'
})
export class CompaniesManagementComponent extends JGSComponent implements OnInit  {

  companies : {
    companyName : string,
    licenseStatus: string,
    expiredLicense: Date
    licenseId: string,
    userCount: number}[] = [];
    companyForm : FormGroup;
    errorMessages = {
      companyName:[
          {type:'required', message:'Campo requerido'},
          {type:'maxlength', message:'Maximo 200 caracteres'}
      ],
      mailAddress:[
          {type:'required', message:'Campo requerido'},
          {type:'maxlength', message:'Maximo 250 caracteres'}
      ],
      contactMail:[
          {type:'required', message:'Campo requerido'},
          {type:'pattern', message:'Correo electrónico no valido'},
          {type:'maxlength', message:'Maximo 250 caracteres'}
      ],
      contactPhone:[
          {type:'required', message:'Campo requerido'},
          {type:'pattern', message:'Telefono no valido'},
          {type:'maxlength', message:'Maximo 10 numeros'}
      ],
      country:[
          {type:'required', message:'Campo requerido'}
      ],
      state:[
          {type:'required', message:'Campo requerido'}
      ],
      principalCity:[
          {type:'required', message:'Campo requerido'}
      ]
    };
  loading:boolean = true;
  newCompany = false;
  showDialogCompany = false;
  countries : Country[]=[];
  states: State[]=[];
  cities: City[]=[];
  companyToEdit : Company;

  constructor(private breadcrumbService: BreadcrumbService,
              private companyService : CompanyService,
              private countryService : CountryService,
              private formBuilder : FormBuilder,
              private stateService : StateService,
              private cityService : CityService,
              private router : Router,
              menulink:MenulinkService,
              messageService : MessageService,
              securityService: SecurityService) { 
      super(messageService, securityService, '/alfred/companies', menulink);
      this.breadcrumbService.setItems([
                  {label: 'Empresas', routerLink: ['companies']}
      ]);
  }
  
  async ngOnInit() {
    this.companyForm = this.formBuilder.group({
      companyName:['', Validators.compose([
                Validators.required,
                Validators.maxLength(200),
                Validators.pattern('^[A-Z a-z 0-9]+$')
      ])],
      mailAddress:['', Validators.compose([
              Validators.required,
              Validators.maxLength(250)
      ])],
      contactMail:['', Validators.compose([
        Validators.required,
        Validators.maxLength(230),
        Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
      ])],
      contactPhone:['', Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^[0-9]+$')
      ])],
      country:['', Validators.compose([
        Validators.required
      ])],
      state:['', Validators.compose([
        Validators.required
      ])],
      principalCity:['', Validators.compose([
        Validators.required
      ])]
    });
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.companies = await this.companyService.getCompaniesInfo(this.message);
    this.countries = await this.countryService.getAllCounries(this.message);
    this.loading = false;
  }

  async loadStates(){
    this.states = await this.stateService.getStatesByCountry(this.message, this.companyForm.get("country").value);
  }

  async loadCities(){
    this.cities = await this.cityService.getCityByState(this.message, this.companyForm.get("state").value, this.companyForm.get("country").value);
  }

  async editCompany(company){
    this.newCompany = false;
    this.showDialogCompany = true;
    this.companyToEdit = await this.companyService.getCompanyByName(this.message, company.companyName);
    this.companyForm.get("companyName").setValue(this.companyToEdit.name);
    this.companyForm.get("contactMail").setValue(this.companyToEdit.contactEmail);
    this.companyForm.get("contactPhone").setValue(this.companyToEdit.contactPhone);
    this.companyForm.get("mailAddress").setValue(this.companyToEdit.mailAddress);
    this.companyForm.get("country").setValue(this.companyToEdit.principalCity.states.countries.countryId);
    this.states = await this.stateService.getStatesByCountry(this.message, this.companyForm.get("country").value);
    this.companyForm.get("state").setValue(this.companyToEdit.principalCity.states.statesPK.id);
    this.cities = await this.cityService.getCityByState(this.message, this.companyForm.get("state").value, this.companyForm.get("country").value);
    this.companyForm.get("principalCity").setValue(this.companyToEdit.principalCity.cityId);
  }

  editLicense(company){
    localStorage.setItem("companyToLicense", company.companyName);
    this.router.navigate(['/alfred/companies/licenses']);
  }

  createCompany(){
    this.companyForm.reset()
    this.newCompany = true;
    this.showDialogCompany = true;
  }

  async saveCompany(){
    this.loading = true;
    if(this.newCompany){
      this.showDialogCompany = ! await this.companyService.registryCompany(this.message, 
        {
          companyName : this.companyForm.get("companyName").value,
          contactEmail : this.companyForm.get("contactMail").value,
          contactPhone : this.companyForm.get("contactPhone").value,
          mailAddress : this.companyForm.get("mailAddress").value,
          principalCity : this.companyForm.get("principalCity").value
        });
    }else{
      this.showDialogCompany = ! await this.companyService.updateCompany(this.message, 
        {
          companyId : this.companyToEdit.companyId,
          companyName : this.companyForm.get("companyName").value,
          contactEmail : this.companyForm.get("contactMail").value,
          contactPhone : this.companyForm.get("contactPhone").value,
          mailAddress : this.companyForm.get("mailAddress").value,
          principalCity : this.companyForm.get("principalCity").value
        });
      this.companyToEdit = null;
    }
    if(!this.showDialogCompany){
      this.companyForm.reset();
      this.companies = await this.companyService.getCompaniesInfo(this.message);
    }
    this.loading = false;
  }

  cancelOperation(){
    this.loading = false;
    this.showDialogCompany=false;
  }

}
