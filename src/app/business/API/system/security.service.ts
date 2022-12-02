import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { APIUser, consultUser } from 'src/environments/environment';
import { LocalSecurity } from '../../co.com.jgs/security/localSecurity';
import { Session } from '../../co.com.jgs/security/session';
import { SessionData } from '../../co.com.jgs/security/session-data';
import { License } from '../../co.com.jgs/subscription/license';
import { Service } from '../../co.com.jgs/system/service';
import { MessageSeverity } from '../../utils/messageserverity';
import { UserOperations } from '../enums/user_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { JGSOutput } from '../model/outputs/jgsoutput';
import { LicenseService } from '../user/license.service';

/**
 * Clase que utiliza el API de sistema de seguridad para realizar las operaciones de autenticacion y demas tramites
 * de seguridad de un usuario ante JGS.
 * @version 1.3
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
 * |   OVALLEGA   | 24/08/2022 |   1.2   |cambio de tipo de respuesta de autenticacion.                             |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 31/08/2022 |   1.3   |Correccion de busqueda de la operacion.                                   |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn: 'root'
})
export class SecurityService extends JGSService{

  service : Service;

  /**
   * Constructor del controlador.
   * @param client client HTTP que realiza la comunicacion.
   * @param jgsHeaders generador de encabezados de peticion.
   */
  constructor(private client: HttpClient,
              private jgsHeadres : JGSHeaders,
              private licenseService : LicenseService,
              private router : Router) { 
                super(client, "session", "v1", APIUser.operationInfoEndpoint);
              }
              
  /**
   * Realiza el login de un usuario ante JGS.
   * @param username usuario a iniciar sesion.
   * @param password contraseña
   * @param messageService servicio de mensajes
   * @returns la sesion de usuario.
   */
  async doLogin(username: string, password: string, messageService : MessageService) : Promise<SessionData>{
    var sessionData : SessionData;
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(UserOperations.AUTENTICARSE, []), 
    {userToLogin : username, password : password}, this.jgsHeadres.getUserSystemHeaders()).toPromise();
    if(response.success){
      sessionData = response.objectToReturn;
      await this.putSessionInStorage(sessionData);
      if(username !== consultUser.username){
        if(sessionData.session.users.userStatus.catalogsPK.itemId === 1){
          this.putUIMessage(messageService, MessageSeverity.error, 'No fue posible iniciar sesion', 'El usuario no esta en un estado valido de operacion. Contacte con su administrador.');
          return null;
        }
        if(!sessionData.license){
          await this.doLogout(messageService, false);
          this.putUIMessage(messageService, MessageSeverity.error, 'No fue posible iniciar sesion', 'La empresa del usuario no cuenta con una licencia valida. Contacte con su administrador.');
          return null;
        }
      }
    }
    if(username !== consultUser.username){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return sessionData;
    
  }

  /**
   * Valida si una sesion de usuario es valida.
   * @param messageService servicio de mensajes
   * @param username el usuario dueño de la sesion.
   * @param sessionId el id de la sesion de usuario.
   * @returns true si la sesion es valida, false en caso contrario.
   */
  async validateUserSession(messageService: MessageService, username : string, sessionId: string) : Promise<boolean>{
    if(username && sessionId){
      var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.VALIDAR_SESION, null), 
      this.jgsHeadres.getUserOnlineHeaders()).toPromise();
      if(!response.success && username !== consultUser.username){
        this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
        this.router.navigate(['/access']);
      }
      return response.success;
    }else{
      this.putUIMessage(messageService, MessageSeverity.warn, "Acceso denegado", "Su sesión de usuario no ha sido encontrada, vuelva a inicar sesión.")
      this.router.navigate(['/access']);
      return false;
    }
    
  }

  /**
   * Realiza el cierre de sesion de un usuario conectado.
   * @param messageService servicio de mensajes
   * @param displayMessage true si se quiere mostrar el mensaje de cierre de sesión, false en caso contrario.
   * @returns true si el cierre de sesion es exitoso, false en caso contrario.
   */
  async doLogout(messageService: MessageService, displayMessage: boolean) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(UserOperations.CIERRE_DE_SESION, null), null,
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(displayMessage){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    localStorage.clear();
    this.router.navigate(['/'])
    return response.success;
  }

  /**
   * Realiza el cierre de sesion de un usuario conectado.
   * @returns true si el cierre de sesion es exitoso, false en caso contrario.
   */
   async doLogoutAuto(){
    await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CIERRE_DE_SESION, null), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    localStorage.clear();
  }

  /**
   * Realiza el login para el usuario de sistema.
   * @param messageService servicio de mensajes
   */
  async doLogginUserSystem(messageService : MessageService){
    if(!localStorage.getItem(consultUser.username ) ||  
       !await this.validateUserSession(messageService, consultUser.username, localStorage.getItem(consultUser.username))){
        var sessionData = await this.doLogin(consultUser.username, consultUser.password, messageService);
        if(sessionData){
          localStorage.setItem(consultUser.username, sessionData.session.sessionsPK.sessionId);
        }else{
          localStorage.removeItem(consultUser.username);
        }
    }
  }

  /**
   * Adiciona la sesion de usuario a la seguridad local.
   * @param sessionData la sesion de usuario a agregar.
   */
  async putSessionInStorage(sessionData: SessionData) {
    localStorage.setItem(LocalSecurity.username, sessionData.session.sessionsPK.username);
    localStorage.setItem(LocalSecurity.sessionId, sessionData.session.sessionsPK.sessionId);
    localStorage.setItem(LocalSecurity.companyId, ""+sessionData.session.users.companyId.companyId);
    localStorage.setItem(LocalSecurity.licenseId, ""+(sessionData.license?sessionData.license.id:"NO ENCONTRADA."));
  }

}
