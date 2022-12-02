import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { City } from '../../co.com.jgs/utils/city';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { CityInput } from '../model/inputs/system/city-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema para llegar a la tabla de cities de la base de datos.
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
export class CityService extends JGSService{

  constructor(private client: HttpClient,
    private jgsHeaders : JGSHeaders) {
     super(client, "city", "v1", APISystem.operationInfoEndpoint);
     }

  /**
   * Registra un pais en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para registrar un pais.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async registryCity(messageService: MessageService, data : CityInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_CIUDAD, null), 
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
   async updateCity(messageService: MessageService, data : CityInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_CIUDAD, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Regresa todas las ciudades del sistema. 
   * @param messageService servicio de mensajes.
   * @returns las ciudades.
   */
   async getAllCities(messageService : MessageService) : Promise<City[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTA_CIUDADES, [null]), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

   /**
   * Regresa una ciudad dado su ID. 
   * @param messageService servicio de mensajes.
   * @param cityId el ID de la ciudad.
   * @returns la ciudad dado su ID o null en caso de no encontrarlo
   */
    async getCityById(messageService : MessageService, cityId : string) : Promise<City>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CIUDAD_POR_ID, [""+cityId]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }

  /**
   * Regresa una ciudad dado su nombre.
   * @param messageService servicio de mensajes.
   * @param cityName el nombre de la ciudad.
   * @returns la ciudad dado su ID o null en caso de no encontrarlo
   */
     async getCityByName(messageService : MessageService, cityName : string) : Promise<City>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CIUDAD_POR_NOMBRE, [""+cityName]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }

    /**
   * Regresa una ciudad dado su estado. 
   * @param messageService servicio de mensajes.
   * @param stateId el id del estado.
   * @param countryId el id del pais.
   * @returns la ciudad dado su estado o null en caso de no encontrarlo
   */
     async getCityByState(messageService : MessageService, stateId : number, countryId: number) : Promise<City[]>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_CIUDAD_POR_ESTADO, [""+stateId, ""+countryId]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }
}
