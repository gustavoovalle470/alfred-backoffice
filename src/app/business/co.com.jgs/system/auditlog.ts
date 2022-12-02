import { User } from "../security/user";

export interface Auditlog {
    auditLogId          : number,
    wsinvoked           : string,
    methodInvoked       : string,
    parametersInvoked   : string,
    succesOperation     : string,
    responseMessage     : string,
    operationDate       : Date,
    username            : User
}
