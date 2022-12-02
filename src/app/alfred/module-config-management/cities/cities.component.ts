import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CityInput } from 'src/app/business/API/model/inputs/system/city-input';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { CityService } from 'src/app/business/API/utils/city.service';
import { CountryService } from 'src/app/business/API/utils/country.service';
import { StateService } from 'src/app/business/API/utils/state.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { City } from 'src/app/business/co.com.jgs/utils/city';
import { Country } from 'src/app/business/co.com.jgs/utils/country';
import { State } from 'src/app/business/co.com.jgs/utils/state';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html'
})
export class CitiesComponent extends JGSComponent implements OnInit {

  cities : City[]=[];
  states : State[]=[];
  countries : Country[]=[];
  showDlgCity = false;
  loadingTable = false;
  newCity = false;
  cityForm : FormGroup;
  errorMessages = {
    cityId:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 200 caracteres'}
    ],
    stateId:[
      {type:'required', message:'Campo requerido'},
      {type:'maxlength', message:'Maximo 200 caracteres'}
    ],
    countryId:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 250 caracteres'}
    ],
    cityName:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Correo electrónico no valido'},
        {type:'maxlength', message:'Maximo 250 caracteres'}
    ]
  };
  constructor(private cityService : CityService,
              private stateService: StateService,
              private countryService: CountryService,
              private formBuilder : FormBuilder,
              menulink: MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/configurations/cities', menulink);
     }

  async ngOnInit(){
    this.cityForm = this.formBuilder.group({
      cityId:['', Validators.compose([
                       Validators.required,
                       Validators.maxLength(20),
                       Validators.pattern('^[A-Za-z0-9]+$')
      ])],
      stateId:['', Validators.required],
      countryId:['', Validators.required],
      cityName:['', Validators.compose([
                     Validators.required,
                     Validators.maxLength(200),
                     Validators.pattern('^[A-Z a-z]+$')
      ])]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.cities = await this.cityService.getAllCities(this.message);
    this.countries = await this.countryService.getAllCounries(this.message);
    this.loadingTable=false;
  }

  async getStatesByCountry(){
    this.states = await this.stateService.getStatesByCountry(this.message, this.cityForm.get("countryId").value);
  }

  async createCity(){
    this.countries = await this.countryService.getAllCounries(this.message);
    this.cityForm.reset()
    this.showDlgCity=true;
    this.loadingTable = true;
    this.newCity = true;
    this.cityForm.get("cityId").enable();
    this.cityForm.get("stateId").enable();
    this.cityForm.get("countryId").enable();
  }

  async editCity(city : City){
    this.showDlgCity=true;
    this.loadingTable = true;
    this.newCity = false;
    this.cityForm.get("cityId").disable();
    this.cityForm.get("stateId").disable();
    this.cityForm.get("countryId").disable();
    this.cityForm.get("cityId").setValue(city.cityId);
    this.cityForm.get("countryId").setValue(city.states.statesPK.idCountry);
    this.states = await this.stateService.getStatesByCountry(this.message, this.cityForm.get("countryId").value);
    this.cityForm.get("stateId").setValue(city.states.statesPK.id);
    this.cityForm.get("cityName").setValue(city.city);
  }

  async saveCity(){
    let data : CityInput ={
      cityId: this.cityForm.get("cityId").value,
      cityName: this.cityForm.get("cityName").value,
      countryId: this.cityForm.get("countryId").value,
      stateId:this.cityForm.get("stateId").value
    }
    if(this.newCity){
      this.showDlgCity = ! await this.cityService.registryCity(this.message, data);
    }else{
      this.showDlgCity = ! await this.cityService.updateCity(this.message, data);
    }
    this.cities = await this.cityService.getAllCities(this.message);
    this.loadingTable=false;
  }

}
