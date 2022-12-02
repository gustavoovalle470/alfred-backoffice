import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { APISystem, APIUser } from 'src/environments/environment';
import { Menulink } from '../../co.com.jgs/security/menulink';
import { MessageSeverity } from '../../utils/messageserverity';
import { SystemOperations } from '../enums/system_operations';
import { UserOperations } from '../enums/user_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { MenulinkInput } from '../model/inputs/system/menulink-input';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de sistema de catalogos para obtener informacion de la tabla menulinks de la base de datos.
 * @version 1.2
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/05/2022 |   1.0   |Creacion del controlador de API para portal                               |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 18/08/2022 |   1.1   |Cambio de interfaz de propagacion de mensajes.                            |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.2   |Correccion de busqueda de la operacion.                                   |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn: 'root'
})
export class MenulinkService extends JGSService{

  /**
   * Constructor del controlador.
   * @param client client HTTP que realiza la comunicacion.
   * @param jgsHeaders generador de encabezados de peticion.
   */
  constructor(private client: HttpClient,
              private jgsHeaders : JGSHeaders,
              private router : Router) {
                super(client, "menulink", "v1", APIUser.operationInfoEndpoint);
               }

   /**
   * Registra una opcion de usuario en el sistema.
   * @param messageService servicio de mensajes
   * @param data los datos para registrar una opcion de usuario.
   * @returns true si fue exitoso, false en caso contrario.
   */
    async registryMenulink(messageService: MessageService, data : MenulinkInput) : Promise<boolean>{
      var response = await this.client.post<JGSOutput>(await this.getEndpoint(UserOperations.REGISTRAR_OPCIONES_DE_USUARIO, null), 
      data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      return response.success;
    }
  
    /**
     * Actualiza una opcion de usuario en el sistema.
     * @param messageService servicio de mensajes
     * @param data los datos para actualizar una opcion de usuario.
     * @returns true si fue exitoso, false en caso contrario.
     */
     async updateMenulink(messageService: MessageService, data : MenulinkInput) : Promise<boolean>{
      var response = await this.client.put<JGSOutput>(await this.getEndpoint(UserOperations.ACTUALIZAR_OPCIONES_DE_USUARIO, null), 
      data, this.jgsHeaders.getUserOnlineHeaders()).toPromise();
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
      return response.success;
  }
  
  /**
   * Regresa todas las opciones de menu.
   * @param messageService servicio de mensajes
   * @returns las opciones de menu del sistema.
   */
   async getAllMenuLinks(messageService : MessageService) : Promise<Menulink[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTA_OPCIONES_DE_USUARIO, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa las opciones de menu para el usuario conectado.
   * @param messageService servicio de mensajes
   * @returns las opciones de menu para el usuario conectado.
   */
  async getMenuLinks(messageService : MessageService) : Promise<Menulink[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTA_OPCIONES_DE_USUARIO_POR_USUARIO, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }


  /**
   * Regresa las opciones de menu para el usuario conectado.
   * @param messageService servicio de mensajes
   * @returns las opciones de menu para el usuario conectado.
   */
   async getNodes(messageService : MessageService) : Promise<string[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTA_LOS_NODOS_DE_LAS_OPCIONES, null), 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  async menuLinkIncludedInLicense(messageService: MessageService, link : string){
    let menulinks = await this.getMenuLinks(messageService);
    if(link === '/dashboard'){
      return;
    }
    if(menulinks){
      for(let menulink of menulinks){
        if(menulink.link === link){
          return;
        }
      }
    }
    this.putUIMessage(messageService, MessageSeverity.error, "Error al navegar", "Parece ser que no tiene acceso a la pagina a la que desea navegar. Verifique e intente nuevamente.")
    this.router.navigate(['/alfred/dashboard']);
  }
}
