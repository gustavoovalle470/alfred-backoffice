import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Auditlog } from 'src/app/business/co.com.jgs/system/auditlog';
import { DateUtil } from 'src/app/business/utils/date-util';
import { APISystem } from 'src/environments/environment';
import { SystemOperations } from '../../enums/system_operations';
import { JGSHeaders } from '../../jgsheaders';
import { JGSService } from '../../jgsservice';
import { JGSOutput } from '../../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema de logs para obtener informacion de la tabla auditlogs de la base de datos.
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
export class AuditlogsService extends JGSService {

  constructor(private client : HttpClient,
              private jgsHeaders: JGSHeaders,
              private dateUtil : DateUtil) { 
                super(client, "auditlog", "v1", APISystem.operationInfoEndpoint);
              }

  /**
   * Obtiene todos los logs del sistema.
   * @param messageService servicio de mensajes.
   * @returns los logs del sistema.
   */
  async getAllLogs(messageService : MessageService) : Promise<Auditlog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_TODOS_LOS_LOGS_DE_AUDITORIA, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene una entrada especifica del log de sistema.
   * @param messageService servicio de mensajes.
   * @param logId el identificador de la entrada de log.
   * @returns la entrada de log encontrada.
   */
  async getLogById(messageService : MessageService, logId : number) : Promise<Auditlog>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_AUDITORIA_POR_LOGS, [""+logId]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Obtiene todas las entradas de log de sistema generadas por un usuario.
   * @param messageService servicio de mensajes.
   * @param username el usuario que se consultará.
   * @returns las entrdas de log generadas por el usuario.
   */
  async getLogsByUsername(messageService : MessageService, username : string) : Promise<Auditlog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_AUDITORIA_POR_USUARIO, [username]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Todas las entradas de log generadas por un microservicio.
   * @param messageService servicio de mensajes.
   * @param wsname nombre del microservicio.
   * @returns las entradas de log generadas por el microservicio.
   */
  async getLogsByWs(messageService : MessageService, wsname : string) : Promise<Auditlog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_AUDITORIA_POR_SERVICIO, [wsname]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
  
  /**
   * Las entradas de log generadas por una operacion especifica de un microservicio.
   * @param messageService servicio de mensajes.
   * @param wsname el nombre del microservicio.
   * @param operationname el nombre de la operacion.
   * @returns las entradas de log de la operacion.
   */
  async getLogsByOperation(messageService : MessageService, wsname : string, operationname : string) : Promise<Auditlog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_AUDITORIA_POR_OPERACION, [wsname, operationname]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Retorna todas las entrdas de log generadas en una fecha especifica.
   * @param messageService servicio de mensajes.
   * @param operationDate la fecha de operacion.
   * @returns las entradas generadas en la fecha de operacion.
   */
  async getLogsByOperationDate(messageService : MessageService, operationDate : Date) : Promise<Auditlog[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_AUDITORIA_POR_FECHA, 
    [this.dateUtil.formatDate(operationDate, 'YYYYMMdd')]), this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
}
