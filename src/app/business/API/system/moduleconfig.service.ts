import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { ModuleConfiguration } from '../../co.com.jgs/system/module-configuration';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { ModuleConfigurationRegistryInput } from '../model/inputs/system/module-config-registry-input';
import { ModuleConfigurationUpdateInput } from '../model/inputs/system/module-config-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema de catalogos para obtener informacion de la tabla menulinks de la base de datos.
 * @version 1.1
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 18/08/2022 |   1.0   |Creacion del controlador de API para portal                               |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.1   |Correccion de busqueda de la operacion.                                   |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn: 'root'
})
export class ModuleconfigService extends JGSService{

  constructor(private client: HttpClient,
              private jgsHeadres : JGSHeaders) { 
                super(client, "moduleconfiguration", "v1", APISystem.operationInfoEndpoint);
              }

  /**
   * Realiza el registro de una licencia en la base de datos.
   * @param messageService servicio de mensajes
   * @param data los datos de registro.
   * @returns la licencia si fue creada, null en caso contrario.
   */
   async registerNewConfiguration(messageService : MessageService, data : ModuleConfigurationRegistryInput) : Promise<boolean>{
    var mconfiguration : ModuleConfiguration;
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_CONFIGURACION, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    mconfiguration = response.objectToReturn;
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Realiza la actualizacion de una licencia en la base de datos.
   * @param messageService servicio de mensajes
   * @param data los datos de actualizacion.
   * @returns true si fue actualizada la licencia, false en caso contrario.
   */
   async updateConfiguration(messageService : MessageService, data : ModuleConfigurationUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_CONFIGURACION, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Obtiene todas las configuraciones de modulo.
   * @param messageService servicio de mensajes.
   * @returns todas las configuraciones de modulo encontradas.
   */
  async getaAllConfigurations(messageService : MessageService) : Promise<ModuleConfiguration[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CONFIGURACION, null), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene todas las configuraciones de modulo dado el nombre del modulo.
   * @param messageService servicio de mensajes.
   * @param moduleName nombre del modulo
   * @returns las configuraciones del modulo.
   */
  async getConfigurationByModule(messageService : MessageService, moduleName: string) : Promise<ModuleConfiguration[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CONFIGURACION_POR_MODULO, [moduleName]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene una configuracion de modulo dado su nombre.
   * @param messageService servicio de mensajes.
   * @param confName el nombre de la configuracion.
   * @returns la configuracion de modulo dado su nombre
   */
  async getConfigurationByName(messageService : MessageService, confName: string) : Promise<ModuleConfiguration>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CONFIGURACION_POR_NOMBRE, [confName]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
}
