import { MessageService } from "primeng/api";
import { MenulinkService } from "../API/system/menulink.service";
import { SecurityService } from "../API/system/security.service";
import { Messages } from "../co.com.jgs/system/messages";
import { MessageSeverity } from "../utils/messageserverity";

export class JGSComponent {

  endpoints : Map<string, string>;
  

  constructor(protected message: MessageService,
              protected security : SecurityService,
              protected principalLink : string,
              protected menulinkService : MenulinkService){
  }

  async validateSession(username: string, sessionId: string){
    if(await this.security.validateUserSession(this.message, username, sessionId)){
       await this.menulinkService.menuLinkIncludedInLicense(this.message, this.principalLink);
    }
  }

  putUIMessage(severity: MessageSeverity, title : string, message : string){
    if(title && title.length > 0 && message && message.length > 0){
      this.message.add({key: 'tst', severity: severity, summary: title, detail: message});
    }else{
      this.message.add({key: 'tst', severity: MessageSeverity.error, summary: "ERROR", detail: "NO SE PUEDE MOSTRAR EL MENSAJE DE RESPUESTA."});
    }
  }

  showJGSMessage(jgsMessage: Messages, errors : string[]){
    if(jgsMessage.type === "INFO"){
      this.putUIMessage(MessageSeverity.info, jgsMessage.title, jgsMessage.message);
    }else if(jgsMessage.type === "SUCCESS"){
      this.putUIMessage(MessageSeverity.success, jgsMessage.title, jgsMessage.message);
    }else if(jgsMessage.type === "WARN"){
      this.putUIMessage(MessageSeverity.warn, jgsMessage.title, jgsMessage.message);
    }else if(jgsMessage.type === "ERROR" || jgsMessage.type === "FATAL"){
      this.putUIMessage(MessageSeverity.error, jgsMessage.title, jgsMessage.message);
    }else{
      this.putUIMessage(MessageSeverity.error, "MENSAJE SIN CATEGORIA", "El mensaje con ID "+jgsMessage.messageId+" es de tipo "+jgsMessage.type+" que no es valido. Contacte con su administrador.");
    }
  }

}
