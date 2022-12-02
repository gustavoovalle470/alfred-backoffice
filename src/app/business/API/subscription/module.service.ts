import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { Module } from '../../co.com.jgs/subscription/module';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { ModuleRegistryInput } from '../model/inputs/user/module-registry-input';
import { ModuleUpdateInput } from '../model/inputs/user/module-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema de modulos para obtener informacion de la tabla modules de la base de datos.
 * @version 1.1
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/05/2022 |   1.0   |Creacion del controlador de API para portal                               |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.1   |Correccion de busqueda de la operacion.                                   |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn: 'root'
})
export class ModuleService extends JGSService{

  constructor(private client: HttpClient,
              private jgsHeadres : JGSHeaders) {
      super(client, "module", "v1", APISystem.operationInfoEndpoint);
  }

  /**
   * Obtiene todos los modulos inscritos en el sistema.
   * @param messageService el servicio de mensajes.
   * @returns los modulos inscritos.
   */
  async getAllModules(messageService : MessageService) : Promise<Module[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_MODULO, null),
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene un modulo dado su identificador.
   * @param messageService el servicio de mensajes.
   * @param moduleId el identificador de modulo.
   * @returns el modulo con ese identificador o null en caso de no encontrarlo.
   */
  async getModuleById(messageService : MessageService, moduleId : string) : Promise<Module>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_MODULO_POR_ID, [moduleId]),
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Registra un modulo en la base de datos.
   * @param messageService el servicio de mensajes.
   * @param data los datos del modulo.
   * @returns true si se registro correctamente, false en caso contrario.
   */
  async registryModule(messageService : MessageService, data : ModuleRegistryInput) : Promise<boolean>{
    var module : Module;
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_MODULO, null), data,
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza un modulo en la base de datos.
   * @param messageService el servicio de mensajes.
   * @param data los datos del modulo para actualizar.
   * @returns true si fue actualizado, false en caso contrario.
   */
  async updateModule(messageService : MessageService, data : ModuleUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_MODULO, null), data,
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }
}
