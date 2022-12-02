import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { Operation } from '../../co.com.jgs/system/operation';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { OperationRegistryInput } from '../model/inputs/system/operation-registry-input';
import { OperationUpdateInput } from '../model/inputs/system/operation-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema de operaciones para obtener informacion de la tabla operations de la base de datos.
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
export class OperationService extends JGSService{

  constructor(private client: HttpClient,
              private jgsHeaders : JGSHeaders) { 
      super(client, "operation", "v1", APISystem.operationInfoEndpoint);
  }

  /**
   * Registra una operacion en la base de datos.
   * @param messageService servicio de mensajes.
   * @param data los dato de la operacion.
   * @returns true si fue exitosa la oepracion, false en caso contrario.
   */
   async registerOperation(messageService : MessageService, data : OperationRegistryInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_OPERACION, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza una operacion en la base de datos.
   * @param messageService servicio de mensajes.
   * @param data los datos a actualizara la operacion.
   * @returns true si se actualizo correctamente, false en caso contrario.
   */
  async updateOperation(messageService : MessageService, data : OperationUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_OPERACION, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Obtiene todas las operaciones del sistema.
   * @param messageService servicio de mensajes.
   * @returns todas las operaciones del sistema.
   */
  async findAllOperations(messageService : MessageService) : Promise<Operation[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_OPERACION, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
}
