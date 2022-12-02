import {Component, OnInit} from '@angular/core';
import { AppMainComponent} from '../main-component/app.main.component';
import {trigger, state, transition, style, animate} from '@angular/animations';
import { UserService } from '../../business/API/user/user.service';
import { LocalSecurity } from '../../business/co.com.jgs/security/localSecurity';
import { User } from '../../business/co.com.jgs/security/user';
import { UserData } from '../../business/co.com.jgs/security/user-data';
import { Catalog } from '../../business/co.com.jgs/system/catalog';
import { CatalogService } from '../../business/API/system/catalog.service';
import { JGSComponent } from '../../business/UIComponents/jgscomponent';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';

@Component({
    selector: 'app-inline-profile',
    template: `
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <p-toast key="tst" [baseZIndex]="99999"></p-toast>
            <div class="user-profile">
                <p-dialog header="{{userOnline? userOnline.username: ''}} - PERFIL DE USUARIO" [(visible)]="showProfileDialog" modal="modal" showEffect="fade" [style]="{width: '50vw'}" [breakpoints]="{'960px': '75vw'}">
                    <div class="card">
                        <h5>INFORMACIÓN PERSONAL</h5>
                        <div class="p-fluid p-formgrid grid">             
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="text" 
                                                   id="name" 
                                                   pInputText 
                                                   formControlName="name"
                                                   style="text-transform:uppercase">
                                            <label for="name">Nombre</label>
                                        </span>
                                        <div>
                                                <ng-container *ngFor="let message of errorMessages.name">
                                                    <div id="nameErrors" class="error-message" *ngIf="profileForm.get('name').hasError(message.type)
                                                    && (profileForm.get('name').dirty || profileForm.get('name').touched)">
                                                        <p-message severity="error" text="{{message.message}}"></p-message>
                                                        <ion-icon name="information-circle-outline"></ion-icon>
                                                    </div>
                                                </ng-container>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="text" 
                                                   id="surname" 
                                                   pInputText 
                                                   formControlName="surname">
                                            <label for="surname">Apellido</label>
                                        </span>
                                        <div>
                                             <ng-container *ngFor="let message of errorMessages.surname">
                                                <div id="surnameErrors" class="error-message" *ngIf="profileForm.get('surname').hasError(message.type)
                                                     && (profileForm.get('surname').dirty || profileForm.get('surname').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                               </div>
                                             </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid grid">             
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <p-dropdown inputId="idType" 
                                                        [options]="idTypes" 
                                                        optionLabel="item"
                                                        optionValue="catalogsPK.itemId"
                                                        formControlName="idType"></p-dropdown>
                                            <label for="idType">Tipo documento</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.idType">
                                                <div id="idTypeErrors" class="error-message" *ngIf="profileForm.get('idType').hasError(message.type)
                                                && (profileForm.get('idType').dirty || profileForm.get('idType').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="text" 
                                                   id="document" 
                                                   pInputText
                                                   formControlName="document">
                                            <label for="document">Documento</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.document">
                                                <div id="documentErrors" class="error-message" *ngIf="profileForm.get('document').hasError(message.type)
                                                && (profileForm.get('document').dirty || profileForm.get('document').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid grid">             
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                        <p-dropdown inputId="gender" 
                                                    [options]="genders" 
                                                    optionLabel="item"
                                                    optionValue="catalogsPK.itemId" 
                                                    formControlName="gender"></p-dropdown>
                                            <label for="gender">Genero</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.gender">
                                                <div id="genderErrors" class="error-message" *ngIf="profileForm.get('gender').hasError(message.type)
                                                && (profileForm.get('gender').dirty || profileForm.get('gender').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5>DATOS DE CONTACTO</h5>
                        <div class="p-fluid p-formgrid grid">             
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="email" 
                                                   id="email" 
                                                   pInputText 
                                                   formControlName="email">
                                            <label for="email">Correo electrónico</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.email">
                                                <div id="emailErrors" class="error-message" *ngIf="profileForm.get('email').hasError(message.type)
                                                && (profileForm.get('email').dirty || profileForm.get('email').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field col-12 md:col-6">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="text" 
                                                id="phone" 
                                                pInputText 
                                                formControlName="phone">
                                            <label for="phone">Teléfono</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.phone">
                                                <div id="phoneErrors" class="error-message" *ngIf="profileForm.get('phone').hasError(message.type)
                                                && (profileForm.get('phone').dirty || profileForm.get('phone').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid grid">             
                            <div class="field col-12">
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12">
                                        <span class="p-float-label">
                                            <input type="text" 
                                                   id="address" 
                                                   pInputText 
                                                   formControlName="address">
                                            <label for="address">Dirección</label>
                                        </span>
                                        <div>
                                            <ng-container *ngFor="let message of errorMessages.address">
                                                <div id="addressErrors" class="error-message" *ngIf="profileForm.get('address').hasError(message.type)
                                                && (profileForm.get('address').dirty || profileForm.get('address').touched)">
                                                    <p-message severity="error" text="{{message.message}}"></p-message>
                                                    <ion-icon name="information-circle-outline"></ion-icon>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ng-template pTemplate="footer">
                            <button pButton icon="pi pi-times" (click)="showProfileDialog=false" label="Cancelar" class="p-button-outlined"></button>
                            <button pButton icon="pi pi-check" type="submit" [disabled]="!profileForm.valid" label="Guardar" class="p-button-outlined"></button>
                    </ng-template>
                </p-dialog>
                <div class="grid">
                    <div class="col-12">
                        <a (click)="showProfileDialog=true" id="sidebar-profile-button">
                            <img src="assets/principal/avatar_users.ico" alt="california-layout"/>
                            <span class="sidebar-profile-name">{{userDataOnline? userDataOnline.name+" "+userDataOnline.surname: ""}}</span>
                            <span class="sidebar-profile-role">{{userOnline? userOnline.username: ""}}</span>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    `,
    animations: [
        trigger('menu', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    providers: [MessageService]
})
export class AppProfileComponent extends JGSComponent implements OnInit{
    
    profileForm : FormGroup;
    errorMessages = {
        name:[
            {type:'required', message:'Campo requerido'},
            {type:'pattern', message:'Nombre no valido'},
            {type:'maxlength', message:'Maximo 250 caracteres'}
        ],
        surname:[
            {type:'required', message:'Campo requerido'},
            {type:'pattern', message:'Apellido no valido'},
            {type:'maxlength', message:'Maximo 250 caracteres'}
        ],
        idType:[
            {type:'required', message:'Campo requerido'}
        ],
        document:[
            {type:'required', message:'Campo requerido'},
            {type:'pattern', message:'Documento no valido'},
            {type:'maxlength', message:'Maximo 10 numeros'}
        ],
        gender:[
            {type:'required', message:'Campo requerido'}
        ],
        email:[
            {type:'required', message:'Campo requerido'},
            {type:'pattern', message:'Correo electrónico no valido'},
            {type:'maxlength', message:'Maximo 250 caracteres'}
        ],
        phone:[
            {type:'required', message:'Campo requerido'},
            {type:'pattern', message:'Telefono no valido'},
            {type:'maxlength', message:'Maximo 10 numeros'}
        ],
        address:[
            {type:'required', message:'Campo requerido'},
            {type:'maxlength', message:'Maximo 250 caracteres'}
        ]
    };
    userOnline : User;
    userDataOnline : UserData;
    showProfileDialog : boolean;
    idTypes : Catalog[] =[];
    genders : Catalog[] =[];
    idType = 0;
    gender = 0;

    constructor(public app: AppMainComponent, 
                private userService : UserService,
                private catalogService: CatalogService,
                private formBuilder : FormBuilder,
                menulink : MenulinkService,
                messageService : MessageService,
                securityService : SecurityService) {
                    super(messageService, securityService, '/dashboard', menulink);
                }

    async ngOnInit(){
        this.profileForm = this.formBuilder.group({
            name:['', Validators.compose([
                          Validators.required,
                          Validators.maxLength(200),
                          Validators.pattern('^[A-Z a-z]+$')
            ])],
            surname:['', Validators.compose([
                         Validators.required,
                         Validators.maxLength(200),
                         Validators.pattern('^[A-Z a-z]+$')
            ])],
            idType:['', Validators.required],
            document:['', Validators.compose([
                          Validators.required,
                          Validators.maxLength(10),
                          Validators.pattern('^[0-9]+$')
            ])],
            gender:['', Validators.required],
            email:['', Validators.compose([
                       Validators.required,
                       Validators.maxLength(230),
                       Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
            ])],
            phone:['', Validators.compose([
                       Validators.required,
                       Validators.maxLength(10),
                       Validators.pattern('^[0-9]+$')
            ])],
            address:['', Validators.compose([
                         Validators.required,
                         Validators.maxLength(250)])
            ]
          });
        if(localStorage.getItem(LocalSecurity.username) && localStorage.getItem(LocalSecurity.sessionId)){
            this.userOnline = await this.userService.getUser(this.message, localStorage.getItem(LocalSecurity.username));
            this.userDataOnline = await this.userService.getUserData(this.message, localStorage.getItem(LocalSecurity.username));
            this.idTypes = await this.catalogService.getCatalog(this.message, 2);
            this.genders = await this.catalogService.getCatalog(this.message, 3);
            this.putProfileInfo();
        }
    }

    putProfileInfo(){
        if(this.userDataOnline){
            this.profileForm.get("name").setValue(this.userDataOnline.name);
            this.profileForm.get("surname").setValue(this.userDataOnline.surname);
            this.profileForm.get("idType").setValue(this.userDataOnline.documentType.catalogsPK.itemId);
            this.profileForm.get("document").setValue(this.userDataOnline.document);
            this.profileForm.get("gender").setValue(this.userDataOnline.gender.catalogsPK.itemId);
            this.profileForm.get("email").setValue(this.userDataOnline.email);
            this.profileForm.get("phone").setValue(this.userDataOnline.phone);
            this.profileForm.get("address").setValue(this.userDataOnline.address);
        }
    }

    async saveProfile(){
        this.showProfileDialog = ! await this.userService.saveUserData(this.message, 
            {
                usernameToUpdate : this.userDataOnline.username,
                companyId: this.userDataOnline.users.companyId.companyId,
                name: this.profileForm.get("name").value,
                surname: this.profileForm.get("surname").value,
                idType : this.profileForm.get("idType").value,
                document : this.profileForm.get("document").value,
                gender : this.profileForm.get("gender").value,
                phone : this.profileForm.get("phone").value,
                address : this.profileForm.get("address").value,
                userStatus: this.userDataOnline.users.userStatus.catalogsPK.itemId
            }
        );
        if(!this.showProfileDialog){
            this.userDataOnline = await this.userService.getUserData(this.message, localStorage.getItem(LocalSecurity.username));
        }
        
    }
}
