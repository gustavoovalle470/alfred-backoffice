import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";
import { Messages } from "../co.com.jgs/system/messages";
import { MessageSeverity } from "../utils/messageserverity";
import { JGSControllerInfo } from "./model/outputs/jgscontrollerinfo";
import { JGSOutput } from "./model/outputs/jgsoutput";

/**
 * Define los metodos minimos que debe tener un servicio JGS.
 * @version 1.1
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/05/2022 |   1.0   |Creacion de la estandarizacion de servicios JGS                           |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.1   |Se modifica la forma como se busca la operacion, para no depender del     |
 * |              |            |         |que puede cambiar de forma facil en la base de datos.                     |
 * ******************************************************************************************************************
 */
export abstract class JGSService {

  operationInfo : JGSControllerInfo;
  endpoints : Map<string, string>;

  constructor(private serviceClient : HttpClient, 
              private controller: String, 
              private version : String,
              private API : String){
  }

  /**
   * Establece si un servicio esta en linea.
   * @returns true si esta en linea, false en caso contrario.
   */
  isOnlineService(): boolean{
    return this.operationInfo!==null;
  }

  /**
   * Devuelve el endpoint del API que se consumira en el servicio.
   * @param operationId el ID de la operacion.
   * @param params parametros de URL
   * @returns el endpoint del API para consumo.
   */
  async getEndpoint(operationId : number, params : string[]) : Promise<string>{
    var URL : string = "";
    if(!this.operationInfo){
      this.operationInfo = await this.serviceInfo();
    }
    let operation = this.getOperation(this.operationInfo.serviceId+"-"+operationId);
    if(operation){
      URL = operation.fullPath;
      let index = 0;
      while(URL.includes("{") && params){
        var param = URL.substring(URL.indexOf("{"), URL.indexOf("}")+1);
        URL = URL.replace(param, params[index]);
        index = index+1;
      }
    }
    return URL;
  }
  
  /**
   * Devuelve la informacion completa del servicio.
   * @returns La informacion del servicio.
   */
  async serviceInfo(): Promise<JGSControllerInfo> {
    try{
      this.API = this.API.replace("CONTROLLER", this.controller.toString());
      this.API = this.API.replace("VERSION", this.version.toString());
      var response = await this.serviceClient.get<JGSOutput>(this.API.toString()).toPromise();
      this.operationInfo = response.objectToReturn;
    }catch(exception){
      console.log("El servicio "+this.controller.toString+" no esta disponible.")
    }
    return this.operationInfo;
  }

  /**
   * Muestra en pantalla una alerta dada su severidad y mensaje.
   * @param service servicio de mensajes.
   * @param severity serveridad del mensaje.
   * @param title titulo de la ventana.
   * @param message mensaje a mostrar.
   */
  putUIMessage(service : MessageService, severity: MessageSeverity, title : string, message : string){
    if(title && title.length > 0 && message && message.length > 0){
      service.add({key: 'tst', severity: severity, summary: title, detail: message});
    }else{
      service.add({key: 'tst', severity: MessageSeverity.error, summary: "ERROR", detail: "NO SE PUEDE MOSTRAR EL MENSAJE DE RESPUESTA."});
    }
  }

  /**
   * Muestra en pantalla un mensaje de respuesta del API.
   * @param service servicio de mensajes.
   * @param jgsMessage respuesta del API.
   */
  showJGSMessage(service : MessageService, jgsMessage: Messages, errorMessages:string[]){
    if(jgsMessage){
      if(jgsMessage.type === "INFO"){
        this.putUIMessage(service, MessageSeverity.info, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "SUCCESS"){
        this.putUIMessage(service, MessageSeverity.success, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "WARN"){
        this.putUIMessage(service, MessageSeverity.warn, jgsMessage.title, jgsMessage.message);
      }else if(jgsMessage.type === "ERROR" || jgsMessage.type === "FATAL"){
        this.putUIMessage(service, MessageSeverity.error, jgsMessage.title, jgsMessage.message);
        if(environment.debugMode){
          console.log("La operacion a finalizado con los siguientes errores:")
          for(let error of errorMessages){
            console.log(error)
          }
        }
      }else{
        this.putUIMessage(service, MessageSeverity.error, "MENSAJE SIN CATEGORIA", "El mensaje con ID "+jgsMessage.messageId+" es de tipo "+jgsMessage.type+" que no es valido. Contacte con su administrador.");
      }
    }
  }

  /**
   * Devuelve una operacion dado su id compuesto ServiceID-OperationID
   * @param operationId el ID compuesto.
   * @returns la operacion con el ID, null en caso de no encontrarlo.
   */
  getOperation(operationId : string){
    if(this.operationInfo && this.operationInfo.operations){
      for(let operation of this.operationInfo.operations){
        if(operation.operationId === operationId){
          return operation;
        }
      }
    }
    return null;
  }
}
