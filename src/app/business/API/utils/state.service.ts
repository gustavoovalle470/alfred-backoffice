import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { State } from '../../co.com.jgs/utils/state';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { StateInput } from '../model/inputs/system/state-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema para llegar a la tabla de states de la base de datos.
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
export class StateService extends JGSService{

  constructor(private client: HttpClient,
    private jgsHeaders : JGSHeaders) {
     super(client, "state", "v1", APISystem.operationInfoEndpoint);
     }

  /**
   * Registra un pais en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para registrar un pais.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async registryState(messageService: MessageService, data : StateInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_ESTADO, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza un pais en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para actualizar un pais.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async updateState(messageService: MessageService, data : StateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_ESTADO, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Regresa todos los paises del sistema. 
   * @param messageService servicio de mensajes.
   * @returns los paises
   */
   async getAllStates(messageService : MessageService) : Promise<State[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_ESTADO, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa un estado dado su ID. 
   * @param messageService servicio de mensajes.
   * @param countryId el ID del pais.
   * @param stateId el ID del estado.
   * @returns el estado dado su ID o null en caso de no encontrarlo
   */
   async getStateById(messageService : MessageService, countryId : number, stateId : number) : Promise<State>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_ESTADO_POR_ID, [""+countryId, ""+stateId]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa un estado dado su nombre. 
   * @param messageService servicio de mensajes.
   * @param stateName el nombre del estado.
   * @returns el estado dado su nombre o null en caso de no encontrarlo
   */
   async getStateByName(messageService : MessageService, stateName : string) : Promise<State>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_ESTADO_POR_NOMBRE, [stateName]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa un estado dado su pais. 
   * @param messageService servicio de mensajes.
   * @param countryId el id del pais.
   * @returns el estado dado su pais o null en caso de no encontrarlo
   */
   async getStatesByCountry(messageService : MessageService, countryId : number) : Promise<State[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_ESTADO_POR_PAIS, [""+countryId]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }
}
