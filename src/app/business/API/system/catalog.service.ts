import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { Catalog } from '../../co.com.jgs/system/catalog';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { CatalogRegistryInput } from '../model/inputs/system/catalog-registry-input';
import { CatalogUpdateInput } from '../model/inputs/system/catalog-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';
import { SecurityService } from './security.service';

/**
 * Clase que utiliza el API de sistema de catalogos para obtener informacion de la tabla catalogs de la base de datos.
 * @version 1.3
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/05/2022 |   1.0   |Creacion del controlador de API para portal                               |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/06/2022 |   1.1   |Cambio por estandarizacion de llamados a endpoints                        |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 18/08/2022 |   1.2   |Cambio de interfaz de propagacion de mensajes. Adicion de operaciones CRUD|
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.3   |Correccion de busqueda de la operacion.                                   |
 * ******************************************************************************************************************
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogService extends JGSService{

  constructor(private client : HttpClient,
              private jgsHeaders: JGSHeaders,
              private securityService: SecurityService) {
                super(client, "catalog", "v1", APISystem.operationInfoEndpoint);
               }

  /**
   * Registra un catalogo en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para registrar un catalogo.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async registryCatalog(messageService: MessageService, data : CatalogRegistryInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_CATALOGO, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza un catalogo en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para actualizar un catalogo.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async updateCatalog(messageService: MessageService, data : CatalogUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_CATALOGO, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  
  /**
   * Obtiene todos los catalogos del sistema.
   * @param messageService servicio de mensajes
   * @returns Un arreglo con todos los catalogos del sistema.
   */
   async getAllCatalog(messageService: MessageService) : Promise<Catalog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CATALOGO, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
  
  /**
   * Obtiene un catalogo completo (con todos sus items) dado si id.
   * @param messageService servicio de mensajes
   * @param catalogId identificador del catalogo. (catalogId en la tabla catalogs.)
   * @returns Un arreglo con todos los items del catalogo.
   */
  async getCatalog(messageService: MessageService, catalogId: number) : Promise<Catalog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CATALOGO_POR_ID_DE_CATALOGO, [""+catalogId]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene un catalogo completo (con todos sus items) dado si id.
   * @param messageService servicio de mensajes
   * @param catalogId identificador del catalogo. (catalogId en la tabla catalogs.)
   * @returns Un arreglo con todos los items del catalogo.
   */
   async getCatalogSystem(messageService: MessageService, catalogId: number) : Promise<Catalog[]>{
    this.securityService.doLogginUserSystem(messageService);
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CATALOGO_POR_ID_DE_CATALOGO, [""+catalogId]), 
    this.jgsHeaders.getUserSystemHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene un item de catalogo dado su id de catalogo y id de item.
   * @param messageService servicio de mensajes
   * @param catalogId identificador del catalogo.
   * @param itemId identificador del item.
   * @returns el item de catalogo dado su id.
   */
   async getItemCatalog(messageService: MessageService, catalogId: number, itemId: number) : Promise<Catalog[]>{
    this.securityService.doLogginUserSystem(messageService);
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CATALOGO_POR_ID, [""+catalogId, ""+itemId]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Retorna el siguiente id de catalogo disponible.
   * @param messageService servicio de mensajes
   * @returns el proximo Id de catalog disponible.
   */
  async getNextCatalogId(messageService : MessageService) : Promise<number>{
    let maxActualId = 0;
    for(let catalog of await this.getAllCatalog(messageService)){
      if(catalog.catalogsPK.catalog > maxActualId){
        maxActualId = catalog.catalogsPK.catalog;
      }
    }
    return maxActualId+1;
  }

  /**
   * Retorna el siguiente id de item dado un catalogo.
   * @param messageService servicio de mensajes
   * @param catalogId Id del catalogo.
   * @returns el proximo Id de item disponible.
   */
   async getNextItemId(messageService : MessageService, catalogId: number) : Promise<number>{
    let maxActualId = 0;
    var catalogComplete = await this.getCatalog(messageService, catalogId);
    if(catalogComplete){
      for(let catalog of catalogComplete){
        if(catalog.catalogsPK.itemId > maxActualId){
          maxActualId = catalog.catalogsPK.itemId;
        }
      }
    }
    return maxActualId+1;
  }
}
