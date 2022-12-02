import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CatalogService } from 'src/app/business/API/system/catalog.service';
import { MenulinkService } from 'src/app/business/API/system/menulink.service';
import { SecurityService } from 'src/app/business/API/system/security.service';
import { LocalSecurity } from 'src/app/business/co.com.jgs/security/localSecurity';
import { Catalog } from 'src/app/business/co.com.jgs/system/catalog';
import { JGSComponent } from 'src/app/business/UIComponents/jgscomponent';
import { MessageSeverity } from 'src/app/business/utils/messageserverity';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html'
})
export class CatalogsComponent extends JGSComponent implements OnInit {

  catalogs : Catalog[]=[];
  showDlgCatalog = false;
  loadingTable = false;
  newCatalog = false;
  disabledGenerator = false;
  catalogForm : FormGroup;
  errorMessages = {
    catalogId:[
        {type:'required', message:'Campo requerido'},
        {type:'pattern', message:'Id del catalogo invalido.'}
    ],
    itemId:[
      {type:'required', message:'Campo requerido'},
      {type:'pattern', message:'Id del catalogo invalido.'}
    ],
    item:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 100 caracteres'}
    ],
    description:[
        {type:'required', message:'Campo requerido'},
        {type:'maxlength', message:'Maximo 250 caracteres'}
    ],
    status:[
    ]
  };

  constructor(private catalogService : CatalogService,
              private formBuilder : FormBuilder,
              menulink : MenulinkService,
              messageService : MessageService,
              securityService : SecurityService) {
      super(messageService, securityService, '/alfred/configurations/catalogs', menulink);
     }

  async ngOnInit(){
    this.catalogForm = this.formBuilder.group({
      catalogId:['', Validators.compose([
                     Validators.required,
                     Validators.pattern('^[0-9]+$')
      ])],
      itemId:[{value: '', disabled:true}, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])],
      item:['', Validators.compose([
                Validators.required,
                Validators.maxLength(100)
      ])],
      description:['', Validators.compose([
                       Validators.maxLength(250)
      ])],
      status:[{value: true, disabled:false}]
    });
    this.loadingTable=true;
    await this.validateSession(localStorage.getItem(LocalSecurity.username), localStorage.getItem(LocalSecurity.sessionId));
    this.catalogs = await this.catalogService.getAllCatalog(this.message);
    this.loadingTable=false;
  }

  createCatalog(){
    this.catalogForm.reset();
    this.catalogForm.get("catalogId").enable();
    this.newCatalog = true;
    this.showDlgCatalog = true;
    this.loadingTable = true;
    this.disabledGenerator = false;
  }

  editCatalog(catalog : Catalog){
    this.disabledGenerator = true;
    this.catalogForm.get("catalogId").disable();
    this.newCatalog = false;
    this.showDlgCatalog = true;
    this.loadingTable = true;
    this.catalogForm.get("catalogId").setValue(catalog.catalogsPK.catalog);
    this.catalogForm.get("itemId").setValue(catalog.catalogsPK.itemId);
    this.catalogForm.get("item").setValue(catalog.item);
    this.catalogForm.get("description").setValue(catalog.description);
    this.catalogForm.get("status").setValue(catalog.status);
  }

  async saveCatalog(){
    if(this.newCatalog){
      this.showDlgCatalog = ! await this.catalogService.registryCatalog(this.message,
        {
          catalogId: this.catalogForm.get("catalogId").value,
          description: this.catalogForm.get("description").value,
          item : this.catalogForm.get("item").value,
          status : this.catalogForm.get("status").value?1:0
        });
    }else{
      this.showDlgCatalog = ! await this.catalogService.updateCatalog(this.message,
        {
          catalogId: this.catalogForm.get("catalogId").value,
          itemId : this.catalogForm.get("itemId").value,
          description: this.catalogForm.get("description").value,
          item : this.catalogForm.get("item").value,
          status : this.catalogForm.get("status").value?1:0
        });
    }
    this.catalogs = await this.catalogService.getAllCatalog(this.message);
    this.loadingTable = false;
  }

  async getNextCatalogId(){
    this.catalogForm.get("catalogId").setValue(await this.catalogService.getNextCatalogId(this.message))
    this.catalogForm.get("catalogId").disable();
    this.disabledGenerator = true;
    this.putUIMessage(MessageSeverity.warn, "Asignando el proximo ID", "Se asignara el "+this.catalogForm.get("catalogId").value+" al catalogo")
    await this.getNextItemId();
  }

  async getNextItemId(){
    this.catalogForm.get("itemId").setValue(await this.catalogService.getNextItemId(this.message, this.catalogForm.get("catalogId").value))
    this.putUIMessage(MessageSeverity.warn, "Asignando el proximo ID", "Se asignara el "+this.catalogForm.get("itemId").value+" al item del catalogo "+this.catalogForm.get("catalogId").value);
  }

  async manualCatalogId(){
    let catalogId = this.catalogForm.get("catalogId").value;
    if(catalogId && this.newCatalog){
      try{
        var catalogIdNumber = Number.parseInt(catalogId);
        this.catalogForm.get("itemId").setValue(await this.catalogService.getNextItemId(this.message, catalogIdNumber))
      this.putUIMessage(MessageSeverity.warn, "Asignando el proximo ID", "Se asignara el "+this.catalogForm.get("itemId").value+" al item del catalogo "+this.catalogForm.get("catalogId").value);
        await this.getNextItemId();
      }catch(exception){
        this.putUIMessage(MessageSeverity.error, "Asignando el proximo ID", "El valor "+catalogId+" no es valido para el ID del catalogo.")
      }
    }
  }

}
