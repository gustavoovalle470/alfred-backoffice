import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { consultUser } from "src/environments/environment";
import { LocalSecurity } from "../co.com.jgs/security/localSecurity";

/**
 * Encabezados de conexion y de seguridad de la API.
 * @version 1.0
 * @autor OvalleGA
 * ******************************************************************************************************************
 * ********************************************** CONTROL DE VERSIONES **********************************************
 * ******************************************************************************************************************
 * |    AUTOR     |   FECHA    | VERSION |                     CAMBIOS REALIZADOS                                   |
 * ******************************************************************************************************************
 * |   OVALLEGA   | 01/05/2022 |   1.0   |Creacion de los encabezados de seguridad.                                 |
 * ******************************************************************************************************************
 */
@Injectable({
  providedIn:'root'
})
export class JGSHeaders {
    
  constructor(){}
  
  /**
   * Retorna el encabezado de seguridad para un usuario conectado.
   * @returns el encabezado de seguridad.
   */
  getUserOnlineHeaders(){
    return {
      headers: new HttpHeaders({
        username  : localStorage.getItem(LocalSecurity.username)?localStorage.getItem(LocalSecurity.username):"SIN USUARIO",
        sessionid : localStorage.getItem(LocalSecurity.sessionId)?localStorage.getItem(LocalSecurity.sessionId):"SIN SESION",
        licenseid : localStorage.getItem(LocalSecurity.licenseId)?localStorage.getItem(LocalSecurity.licenseId):"SIN LICENCIA"
      })
    };   
  }

  /**
   * Retorna el encabezado de seguridad para el usuario de sistema asignado para el aplicativo.
   * @returns el encabezado de seguridad para el usuario de sistema.
   */
  getUserSystemHeaders(){
    return {
      headers: new HttpHeaders({
        username  : consultUser.username,
        sessionid : localStorage.getItem(consultUser.username)?localStorage.getItem(consultUser.username):"",
        licenseid : consultUser.licenseid,
      })
    };
  }

  /**
   * Genera un encabezado de seguridad dados los datos independientes de un usario en sesion.
   * @param username nombre de usuario en sesion.
   * @param sessionId id de la sesion del usuario.
   * @param licenseId id de la licencia del usuario.
   * @returns el encabezado de seguridad.
   */
  getHeaders(username: string, sessionId: string, licenseId: string){
    return {
      headers: new HttpHeaders({
        username  : username,
        sessionid : sessionId,
        licenseid : licenseId,
      })
    };
  }
}
