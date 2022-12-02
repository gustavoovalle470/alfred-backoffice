import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { CountryService } from 'src/app/business/API/utils/country.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Country } from 'src/app/business/co.com.jgs/utils/country';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html'
})
export class CountriesComponent extends JGSComponent implements OnInit {

  countries : Country[]=[];
  showDlgCountry = false;
  loadingTable = false;
  newCountry = false;
  countryForm : FormGroup;
  errorMessages = {
    countryId:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 200 caracteres'}
    ],
    countryName:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 200 caracteres'}
    ],
    iso2:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Solo se permiten letras mayúsculas'},
        {type:'maxlength', message:'Máximo 2 caracteres'}
    ],
    iso3:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Solo se permiten letras mayúsculas'},
        {type:'maxlength', message:'Máximo 3 caracteres'}
    ],
    phoneCode:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Telefono no valido'},
        {type:'maxlength', message:'Maximo 10 numeros'}
    ]
  };

  constructor(private countryService : CountryService,
              private formBuilder : FormBuilder,
              messageService : MessageService,
              menulink : MenulinkService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/configurations/countries', menulink);
     }

  async ngOnInit(){
    this.countryForm = this.formBuilder.group({
      countryId:[{value:'', disabled:true}],
      countryName:['', Validators.compose([
                       Validators.required,
                       Validators.maxLength(200),
                       Validators.pattern('^[A-Z a-z0-9]+$')
      ])],
      iso2:['', Validators.compose([
                Validators.required,
                Validators.maxLength(2),
                Validators.pattern('^[A-Z]+$')
      ])],
      iso3:['', Validators.compose([
                Validators.required,
                Validators.maxLength(3),
                Validators.pattern('^[A-Z]+$')
      ])],
      phoneCode:['', Validators.compose([
                     Validators.required,
                     Validators.maxLength(10),
                     Validators.pattern('^\\+[0-9]+$')
      ])]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.countries = await this.countryService.getAllCounries(this.message);
    this.loadingTable=false;
  }

  createCountry(){
    this.countryForm.reset();
    this.showDlgCountry = true;
    this.newCountry = true;
    this.loadingTable = true;
  }

  editCountry(country : Country){
    this.showDlgCountry = true;
    this.newCountry = false;
    this.loadingTable = true;
    this.countryForm.get("countryId").setValue(country.countryId);
    this.countryForm.get("countryName").setValue(country.country);
    this.countryForm.get("iso2").setValue(country.iso2);
    this.countryForm.get("iso3").setValue(country.iso3);
    this.countryForm.get("phoneCode").setValue(country.phoneCode);
  }

  async saveCountry(){
    if(this.newCountry){
      this.showDlgCountry = ! await this.countryService.registryCountry(this.message,
        {
          countryName : this.countryForm.get("countryName").value,
          iso2        : this.countryForm.get("iso2").value,
          iso3        : this.countryForm.get("iso3").value,
          phoneCode   : this.countryForm.get("phoneCode").value
        });
    }else{
      this.showDlgCountry = ! await this.countryService.updateCountry(this.message,
        {
          countryId   : this.countryForm.get("countryId").value,
          countryName : this.countryForm.get("countryName").value,
          iso2        : this.countryForm.get("iso2").value,
          iso3        : this.countryForm.get("iso3").value,
          phoneCode   : this.countryForm.get("phoneCode").value
        });
    }
    this.countries = await this.countryService.getAllCounries(this.message);
    this.loadingTable = false;
  }

}
