import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem, APIUser } from 'src/environments/environment';
import { License } from '../../co.com.jgs/subscription/license';
import { SystemOperations } from '../enums/system_operations';
import { UserOperations } from '../enums/user_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { LicenseAddModuleInput } from '../model/inputs/user/license-add-module-input';
import { LicenseRegistryInput } from '../model/inputs/user/license-registry-input';
import { LicenseUpdateInput } from '../model/inputs/user/license-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de usuarios para realizar llegar a la tabla de licencias de la base de datos.
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
export class LicenseService extends JGSService{

  /**
   * Constructor del controlador.
   * @param client client HTTP que realiza la comunicacion.
   * @param jgsHeaders generador de encabezados de peticion.
   * @param uiAlert generador de alertas graficas.
   */
   constructor(private client: HttpClient,
               private jgsHeadres : JGSHeaders) {
                super(client, "license", "v1", APISystem.operationInfoEndpoint);
                }


  /**
   * Regresa la licencia dado su ID. 
   * @param messageService servicio de mensajes.
   * @param licenseId el id de la licencia.
   * @returns la licencia encontrada.
   */
   async getLicenseById(messageService: MessageService, licenseId: string) : Promise<License>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_LICENCIA_POR_ID, [licenseId]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa la licencia dada una empresa informada. 
   * @param messageService servicio de mensajes.
   * @param companyId el id de la empresa.
   * @returns las licencias encontradas.
   */
  async getLicenseByCompany(messageService : MessageService, companyId: number) : Promise<License[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_LICENCIAS_POR_EMPRESA, [""+companyId]), 
    this.jgsHeadres.getUserSystemHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Retorna la licencia mas reciente de una empresa.
   * @param messageService servicio de mensajes.
   * @param companyId id de la empresa.
   * @returns la licencia mas reciente.
   */
  async getMostRecentLicenseByCompanyId(messageService : MessageService, companyId: number): Promise<License> {
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.LICENCIA_MAS_RECIENTE, [""+companyId]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Realiza el registro de una licencia en la base de datos.
   * @param messageService servicio de mensajes.
   * @param data los datos de registro.
   * @returns la licencia si fue creada, null en caso contrario.
   */
  async registerNewLicense(messageService : MessageService, data : LicenseRegistryInput) : Promise<License>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_LICENCIA, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.objectToReturn;
  }

  /**
   * Realiza la actualizacion de una licencia en la base de datos.
   * @param messageService servicio de mensajes.
   * @param data los datos de actualizacion.
   * @returns true si fue actualizada la licencia, false en caso contrario.
   */
   async updateLicense(messageService : MessageService, data : LicenseUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_LICENCIA, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Adiciona o remueve modulos a una licencia.
   * @param messageService servicio de mensajes.
   * @param data los datos de la operacion de adicion o remocion de modulos.
   * @returns true si fue actualizada la licencia, false en caso contrario.
   */
   async addModuleToLicense(messageService: MessageService, data : LicenseAddModuleInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ADMINISTRAR_MODULOS_A_LICENCIA, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }
}
