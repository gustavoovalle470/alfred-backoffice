import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APISystem, APIUser } from 'src/environments/environment';
import { User } from '../../co.com.jgs/security/user';
import { Company } from '../../co.com.jgs/subscription/company';
import { License } from '../../co.com.jgs/subscription/license';
import { SystemOperations } from '../enums/system_operations';
import { UserOperations } from '../enums/user_operations';
import { JGSHeaders } from '../jgsheaders';
import { JGSService } from '../jgsservice';
import { CompanyRegistryInput } from '../model/inputs/user/company-registry-input';
import { CompanyUpdateInput } from '../model/inputs/user/company-update-input';
import { JGSOutput } from '../model/outputs/jgsoutput';
import { LicenseService } from '../user/license.service';
import { UserService } from '../user/user.service';

/**
 * Clase que utiliza el API de usuario de empresas para obtener informacion de la tabla companies de la base de datos.
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
export class CompanyService extends JGSService{

  constructor(private client: HttpClient,
              private jgsHeadres : JGSHeaders,
              private userService : UserService,
              private licenseService : LicenseService) {
      super(client, "company", "v1", APISystem.operationInfoEndpoint);
     }
  
  /**
   * Registra una empresa nueva.
   * @param messageService el servicio de mensajes.
   * @param data los datos a registrar.
   * @returns true si la empresa fue registrada, false en caso contrario.
   */
  async registryCompany(messageService: MessageService, data : CompanyRegistryInput) : Promise<boolean>{
    var response = await this.client.post<JGSOutput>(await this.getEndpoint(SystemOperations.REGISTRAR_EMPRESA, null), data,
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Actualiza la informacion de una empresa.
   * @param messageService el servicio de mensajes.
   * @param data los datos de la empresa.
   * @returns true si fue exitoso, false en caso contrario.
   */
  async updateCompany(messageService: MessageService, data : CompanyUpdateInput) : Promise<boolean>{
    var response = await this.client.put<JGSOutput>(await this.getEndpoint(SystemOperations.ACTUALIZAR_EMPRESA, null), data,
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    return response.success;
  }

  /**
   * Retorna todas las empresas de la base de datos.
   * @param messageService el servicio de mensajeria.
   * @returns todas las empresas encontradas, null en caso de no encontrar.
   */
  async getAllCompanies(messageService: MessageService) : Promise<Company[]>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_EMPRESAS, null),
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Regresa una empresa dado su nombre. 
   * @param companyName el nombre de la empresa.
   * @param messageService el servicio de mensajes.
   * @returns el pais dado su nombre o null en caso de no encontrarlo
   */
   async getCompanyByName(messageService: MessageService, companyName : string) : Promise<Company>{
    var response = await this.client.get<JGSOutput>(await this.getEndpoint(SystemOperations.CONSULTAR_EMPRESA_POR_NOMBRE, [companyName]), 
    this.jgsHeadres.getUserOnlineHeaders()).toPromise();
    if(!response.success){
      this.showJGSMessage(messageService, response.messageResponse, response.errorMessages);
    }
    return response.objectToReturn;
  }

  /**
   * Genera la informacion de las compañias de la base de datos.
   * @param messageService el servicio de mensajes.
   * @returns la informacion que se mostrara en pantalla.
   */
  async getCompaniesInfo(messageService : MessageService){
    var companiesInfo : {
      companyName : string,
      licenseStatus: string,
      expiredLicense: Date
      licenseId: string,
      userCount: number}[] = [];
    var companies = await this.getAllCompanies(messageService);
    for(let company of companies){
      var license : License = await this.licenseService.getMostRecentLicenseByCompanyId(messageService, company.companyId);
      companiesInfo.push({
        companyName : company.name,
        licenseStatus : this.getLicenseStatus(license),
        expiredLicense: this.getExpiredLicenseDate(license),
        licenseId     : license?license.id:"SIN ASGINAR",
        userCount     : await this.getUsersInCompany(messageService, company.companyId)
      })
    }
    return companiesInfo;
  }
  
  /**
   * Obtiene la cantidad de usuarios que pertenecen a una empresa.
   * @param companyId el identificador de la empresa.
   * @returns la cantidad de usuarios que pertenecen a la empresa.
   */
  async getUsersInCompany(messageService : MessageService, companyId: number): Promise<number> {
    var usersInCompany = 0;
    var users: User[] = await this.userService.getAllUsers(messageService);
    for(let user  of users){
      if(user.companyId.companyId === companyId){
        usersInCompany = usersInCompany + 1;
      }
    }
    return usersInCompany;
  }

  /**
   * Obtiene el estado de una licencia.
   * @param license la licencia a verificar.
   * @returns el estado actual de la licencia.
   */
  getLicenseStatus(license: License): string {
    if(license){
      var final = new Date(license.start);
      final.setDate(final.getDate() + license.daysOfValidity);
      return final >= new Date()?"VALIDA":"VENCIDA";
    }else{
      return "SIN LICENCIA ASIGNADA";
    }
  }

  /**
   * 
   * @param license Obtiene la fecha de vencimiento de una licencia.
   * @returns la fecha de vencimiento.
   */
  getExpiredLicenseDate(license: License): Date {
    var finalDate : Date = null;
    if(license){
      var finalDate = new Date(license.start);
      finalDate.setDate(finalDate.getDate()+license.daysOfValidity);
    }
    return finalDate;
  }
}

