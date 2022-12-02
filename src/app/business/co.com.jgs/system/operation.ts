import { OperationPK } from "./operation-pk";
import { Service } from "./service";

export interface Operation {
    operationsPK    : OperationPK,
    name            : string,
    desciption      : string,
    active          : number,
    controller      : string,
    version         : string,
    operation       : string,
    auditable       : number,
    services        : Service;
}
