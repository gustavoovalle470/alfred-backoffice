import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StateInput } from 'src/app/business/API/model/inputs/system/state-input';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { CountryService } from 'src/app/business/API/utils/country.service';
import { StateService } from 'src/app/business/API/utils/state.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Country } from 'src/app/business/co.com.jgs/utils/country';
import { State } from 'src/app/business/co.com.jgs/utils/state';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html'
})
export class StatesComponent extends JGSComponent implements OnInit{

  states: State[]=[];
  countries : Country[]=[];
  showDlgState = false;
  loadingTable = false;
  newState = false;
  stateForm : FormGroup;
  errorMessages = {
    stateId:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Nombre de estado no valido'}
    ],
    countryId:[
      {type:'required', message:'Campo requerido'}
    ],
    stateName:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Nombre de estado no valido'}
    ]
  };

  constructor(private stateService : StateService,
              private countryService: CountryService,
              private formBuilder : FormBuilder,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
                super(messageService, securityService, '/alfred/configurations/states', menulink);
               }

    async ngOnInit(){
      this.stateForm = this.formBuilder.group({
        stateId:['', Validators.compose([
                     Validators.required,
                     Validators.pattern('^[0-9]+$')
        ])],
        countryId:['', Validators.required],
        stateName:['', Validators.compose([
                  Validators.required,
                  Validators.maxLength(200),
                  Validators.pattern('^[A-Za-z ]+$')
        ])]
      });
      this.loadingTable=true;
      await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
      this.states = await this.stateService.getAllStates(this.message);
      this.countries = await this.countryService.getAllCounries(this.message);
      this.loadingTable=false;
    }

    async createState(){
      this.countries = await this.countryService.getAllCounries(this.message);
      this.stateForm.reset();
      this.newState=true;
      this.showDlgState = true;
      this.loadingTable = true;
      this.stateForm.get("stateId").enable();
      this.stateForm.get("countryId").enable();
    }

    editState(state : State){
      this.newState=false;
      this.showDlgState = true;
      this.loadingTable = true;
      this.stateForm.get("stateId").disable();
      this.stateForm.get("countryId").disable();
      this.stateForm.get("stateId").setValue(state.statesPK.id);
      this.stateForm.get("countryId").setValue(state.statesPK.idCountry);
      this.stateForm.get("stateName").setValue(state.stateName);
    }

    async saveState(){
      let data : StateInput ={
        countryId : this.stateForm.get("countryId").value,
        stateId   : this.stateForm.get("stateId").value,
        stateName : this.stateForm.get("stateName").value
      };
      if(this.newState){
        this.showDlgState = ! await this.stateService.registryState(this.message, data);
      }else{
        this.showDlgState = ! await this.stateService.updateState(this.message, data);
      }
      this.states = await this.stateService.getAllStates(this.message);
      this.loadingTable = false;
    }
}
