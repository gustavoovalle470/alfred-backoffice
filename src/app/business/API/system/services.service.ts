import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem } from 'src/environments/environment';
import { Messages } from '../../co.com.jgs/system/messages';
import { Service } from '../../co.com.jgs/system/service';
import { MessageSeverity } from '../../utils/messageserverity';
import { JGSHeaders } from '../jgsheaders';
import { ServiceRegistryInput } from '../model/inputs/system/service-registry-input';
import { ServiceUpdateInput } from '../model/inputs/system/service-update-input';
import { JGSOperationInfo } from '../model/outputs/jgsoperationinfo';
import { JGSOutput } from '../model/outputs/jgsoutput';

/**
 * Clase que utiliza el API de servicio para realizar accesar la tabla services de la base de datos.
 * @version 1.0
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 18/08/2022 |   1.0   |Creacion del controlador de API para portal                               |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  endpoint = APISystem.operationInfoEndpoint;


  constructor(private client : HttpClient,
              private jgsHeaders: JGSHeaders){
                this.endpoint = this.endpoint.replace("CONTROLLER", "service");
                this.endpoint = this.endpoint.replace("VERSION", "v1");
                this.endpoint = this.endpoint.replace("operationInfo", "");
  }

  /**
   * Registra un servicio en la base de datos.
   * @param messageService servicio de mensajes.
   * @param serviceData los dato del servicio.
   * @returns true si fue exitosa la oepracion, false en caso contrario.
   */
  async registerService(messageService : MessageService, serviceData : ServiceRegistryInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(this.endpoint+"registry", serviceData, 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza un servicio en la base de datos.
   * @param messageService servicio de mensajes.
   * @param serviceData los datos a actualizara del servicio.
   * @returns true si se actualizo correctamente, false en caso contrario.
   */
  async updateService(messageService : MessageService, serviceData : ServiceUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(this.endpoint+"update", serviceData, 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Obtiene todos los servicios del sistema.
   * @param messageService servicio de mensajes.
   * @returns todos los servicios del sistema.
   */
  async findAllService(messageService : MessageService) : Promise<Service[]>{
    var response = await this.client.get<JGSOutput>(this.endpoint+"getService", 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Busca un servicio dado su ID.
   * @param messageService servicio de mensajes.
   * @param serviceid el ID del servicio.
   * @returns retorna el servicio dado su ID.
   */
  async findServiceById(messageService : MessageService, serviceid : number) : Promise<Service>{
    var response = await this.client.get<JGSOutput>(this.endpoint+"getService/byId/"+serviceid, 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Devuelve todos los servicios dado un modulo.
   * @param messageService servicio de mensajes.
   * @param moduleid identificador de modulo.
   * @returns los servicios que pertenecen al modulo.
   */
  async findServiceByModule(messageService : MessageService, moduleid : string) : Promise<Service[]>{
    var response = await this.client.get<JGSOutput>(this.endpoint+"getService/byModule/"+moduleid, 
    this.jgsHeaders.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Retorna si un servicio esta en linea o no.
   * @returns true si esta en linea. false en caso contrario.
   */
  async isOnlineService(): Promise<boolean>{
    try{
      await this.serviceStatus();
      return true;
    }catch(exception){
      return false;
    }
  }

  /**
   * Valida el estado de un servicio.
   * @returns la informacion del servicio, null en caso de no estar activo.
   */
  async serviceStatus(): Promise<JGSOperationInfo>{
    return await this.client.get<JGSOperationInfo>(this.endpoint+"operationInfo").toPromise();
  }

  /**
   * Muestra un mensaje en la interfaz gracfica.
   * @param service servicio de mensajes.
   * @param jgsMessage el mensaje a mostrar.
   */
  showJGSMessage(service : MessageService, jgsMessage: Messages, errorMessages : string[]){
    if(jgsMessage){
      if(jgsMessage.type === "INFO"){
        this.putUIMessage(service, MessageSeverity.info, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "SUCCESS"){
        this.putUIMessage(service, MessageSeverity.success, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "WARN"){
        this.putUIMessage(service, MessageSeverity.warn, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "ERROR" || jgsMessage.type === "FATAL"){
        this.putUIMessage(service, MessageSeverity.error, jgsMessage.title, jgsMessage.message);
      }else{
        this.putUIMessage(service, MessageSeverity.error, "MENSAJE SIN CATEGORIA", "El mensaje con ID "+jgsMessage.messageId+" es de tipo "+jgsMessage.type+" que no es valido. Contacte con su administrador.");
      }
    }
  }

  /**
   * Muestra un mensaje en la interfaz grafica.
   * @param service servicio de mensajes.
   * @param severity severidad del mensaje
   * @param title titulo de la ventana emergente.
   * @param message el mensaje a mostrar.
   */
  putUIMessage(service : MessageService, severity: MessageSeverity, title : string, message : string){
    if(title && title.length > 0 && message && message.length > 0){
      service.add({key: 'tst', severity: severity, summary: title, detail: message});
    }else{
      service.add({key: 'tst', severity: MessageSeverity.error, summary: "ERROR", detail: "NO SE PUEDE MOSTRAR EL MENSAJE DE RESPUESTA."});
    }
  }
}
