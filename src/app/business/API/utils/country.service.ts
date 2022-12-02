import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { Country } from '../../co.com.jgs/utils/country';
import { SystemOperations } from '../enums/system_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { CountryRegistryInput } from '../model/inputs/system/country-registry-input';
import { CountryUpdateInput } from '../model/inputs/system/country-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema para llegar a la tabla de countries de la base de datos.
 * @version 1.0
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
export class CountryService extends JGSService{

  constructor(private client: HttpClient,
              private jgsHeaders : JGSHeaders) {
     super(client, "country", "v1", APISystem.operationInfoEndpoint);
     }
  
  /**
   * Registra un pais en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para registrar un pais.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async registryCountry(messageService: MessageService, data : CountryRegistryInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_PAIS, null), 
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
   async updateCountry(messageService: MessageService, data : CountryUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_PAIS, null), 
    data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Regresa todos los paises del sistema.
   * @param messageService servicio de mensajes.
   * @returns los paises
   */
    async getAllCounries(messageService : MessageService) : Promise<Country[]>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_PAIS, [null]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }

  /**
   * Regresa un pais dado su nombre.
   * @param messageService servicio de mensajes.
   * @param countryName el nombre del pais.
   * @returns el pais dado su nombre o null en caso de no encontrarlo
   */
     async getCountryByName(messageService : MessageService, countryName : string) : Promise<Country>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_PAIS_POR_NOMBRE, [countryName]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }

  /**
   * Regresa un pais dado su ID. 
   * @param messageService servicio de mensajes.
   * @param countryId el ID del pais.
   * @returns el pais dado su ID o null en caso de no encontrarlo
   */
     async getCountryById(messageService : MessageService, countryId : string) : Promise<Country>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_PAIS_POR_ID, [countryId]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }

    /**
   * Regresa un pais dado su codigo telefonico. 
   * @param messageService servicio de mensajes.
   * @param phoneCode el codigo telefonico del pais.
   * @returns el pais dado su codigo telefonico o null en caso de no encontrarlo
   */
     async getCountryByPhoneCode(messageService : MessageService, phoneCode : string) : Promise<Country>{
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_PAIS_POR_CODIGO_TELEFONICO, [phoneCode]), 
      this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      if(!response.success){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      }
      return response.objectToReturn;
    }
}
