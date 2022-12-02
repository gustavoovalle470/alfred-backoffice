import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../../co.com.jgs/security/user-data';
import { JGSExpiredPasswordOutput } from '../model/outputs/user/jgsexpiredpasswordoutput';
import { JGSHeaders } from '../jgsheaders';
import { JGSOutput } from '../model/outputs/jgsoutput';
import { RecoverPwdInput } from '../model/inputs/user/recover-pwd-input';
import { PasswordStatus } from '../../co.com.jgs/utils/passwordStatus';
import { User } from '../../co.com.jgs/security/user';
import { JGSService } from '../jgsservice';
import { APIUser } from 'src/environments/environment';
import { UserUpdateInput } from '../model/inputs/user/user-update-input';
import { UserRegisterInput } from '../model/inputs/user/user-register-input';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../system/security.service';
import { UserOperations } from '../enums/user_operations';

/**
 * Clase que utiliza el API de usuarios para realizar llegar a la tabla de usuarios de la base de datos.
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
export class UserService extends JGSService{

  /**
   * Constructor del controlador.
   * @param client client HTTP que realiza la comunicacion.
   * @param jgsHeaders generador de encabezados de peticion.
   */
  constructor(private client: HttpClient,
              private jgsHeadres : JGSHeaders,
              private securityService : SecurityService) {
                super(client, "user", "v1", APIUser.operationInfoEndpoint);
               }

  /**
   * Retorna los datos de un usuario.
   * @param messageService servicio de mensajes.
   * @param username el usuario a quien se le consultara los datos.
   * @returns los datos de usuario.
   */
  async getUserData(messageService : MessageService, username: string) : Promise<UserData>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTAR_TODOS_LOS_DATOS_DE_USUARIO_POR_USERNAME, [username]), 
    this.jgsHeadres.getUserOnlineHeaders())
    .toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Realiza la recuperacion de una contraseña.
   * @param messageService servicio de mensajes.
   * @param input los datos de solicitud de recuperacion de contraseña.
   * @returns true si el proceso finaliza con exito, false en caso contrario.
   */
  async doRecoverPasswrod(messageService : MessageService, input: RecoverPwdInput) : Promise<boolean>{
    this.securityService.doLogginUserSystem(messageService);
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(UserOperations.RECUPERACION_CLAVE, []), input, 
    this.jgsHeadres.getUserSystemHeaders())
    .toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Valida si la contraseña del usuario conectado esta vencida.
   * @returns true si el usuario tiene su contraseña vencida, false en caso contrario.
   */
  async isExpiredPasswordUserOnline() : Promise<PasswordStatus>{
    var status : PasswordStatus = { daysToExpired : 0, expired : false};
    var response = await this.client.get<JGSExpiredPasswordOutput>(await this.getEndpoint(UserOperations.CONSULTAR_SI_LA_CLAVE_ESTA_VENCIDA, []), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(response.success){
      status.daysToExpired = response.daysToExpired;
      status.expired = response.expired;
    }
    return status;
  }

  /**
   * Valida si la contraseña de un usuario esta vencida.
   * @param username el usuario a consultar
   * @returns true si el usuario tiene su contraseña vencida, false en caso contrario.
   */
  async isExpiredPasswordForUser(username: string) : Promise<JGSExpiredPasswordOutput>{
    return await this.client.get<JGSExpiredPasswordOutput>(await this.getEndpoint(UserOperations.CONSULTAR_SI_LA_CLAVE_ESTA_VENCIDA_POR_USUARIO, [username]), 
                 this.jgsHeadres.getUserOnlineHeaders())
                .toPromise();

  }

  /**
   * Realiza el cambio de una contraseña.
   * @param messageService servicio de mensajes.
   * @param oldPassword la contraseña anterior.
   * @param newPassword la nueva contraseña.
   * @returns la respuesta del servicio de cambio de contraseña.
   */
  async changePassword(messageService: MessageService, oldPassword : string, newPassword : string) : Promise<boolean>{
    let response = await this.client.put<JGSOutput>(await this.getEndpoint(UserOperations.CAMBIO_DE_CLAVE, []), {oldPassword:oldPassword, newPassword:newPassword}, 
    this.jgsHeadres.getUserOnlineHeaders())
   .toPromise();
   this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Retorna un usuario dado su nickname.
   * @param messageService servicio de mensajes.
   * @param username el nickname.
   * @returns el usuario encontrado con ese nickname.
   */
  async getUser(messageService: MessageService, username : string) : Promise<User>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTAR_USUARIOS_POR_USERNAME, [username]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Retorna todos los usuarios registrados en el sistema.
   * @param messageService servicio de mensajes.
   * @returns todos los usuarios registrados.
   */
  async getAllUsers(messageService : MessageService) : Promise<User[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONSULTA_USUARIOS, null),
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Guardda la informacion personal de un usuario conectado.
   * @param messageService servicio de mensajes.
   * @param data la informacion a actualizar.
   * @returns true si fue exitoso, false en caso contrario.
   */
  async saveUserData(messageService : MessageService, data: UserUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(UserOperations.ACTUALIZAR_USUARIO, []), data, 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages)
    return response.success;
  }

  /**
   * Guardda la informacion personal de un usuario conectado.
   * @returns true si fue exitoso, false en caso contrario.
   */
   async getCountSession() : Promise<number>{
    var sessions : number = 0;
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.CONTAR_SESIONES_ABIERTAS, []), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(response.success){
      sessions = response.objectToReturn;
    }
    return sessions;
  }

  /**
   * Verifica si un usuario esta en linea.
   * @param username el nombre de usuario
   * @returns true si esta en linea, false en caso contrario.
   */
  async isUserOnline(username : string){
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(UserOperations.USUARIO_EN_LINEA, [username]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    var isOnline : boolean = response.objectToReturn;
    return response.success && isOnline;
  }

  /**
   * Obtiene los detalles a mostrar de un usuario.
   * @param messageService servicio de mensajes.
   * @returns los detalles de un usuario.
   */
  async getUsersDetails(messageService : MessageService){
    var users : {user : User,
      loginStatus: string,
      passwordStatus : string}[] = [];
    for(let user of await this.getAllUsers(messageService)){
      var passwordStatus = "SIN EVALUAR";
      if(user.userStatus.catalogsPK.itemId !==1){
        passwordStatus = (await this.isExpiredPasswordForUser(user.username)).expired?"VENCIDA":"CORRECTA";
      }else{
        passwordStatus = "USUARIO DE SISTEMA";
      }
      users.push({user: user, 
                       loginStatus: await this.isUserOnline(user.username)?"EN LINEA":"FUERA DE LINEA", 
                       passwordStatus: passwordStatus});
    }
    return users;
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param messageService servicio de mensajes.
   * @param data los datos del nuevo usuario.
   * @return true si fue registrado, false en caso contrario.
   */
  async registerNewUser(messageService: MessageService, data : UserRegisterInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(UserOperations.REGISTRAR_USUARIO, null), 
    data, this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }
}
