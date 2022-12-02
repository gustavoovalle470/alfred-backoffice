import { JGSOperationInfo } from "./jgsoperationinfo";

export interface JGSControllerInfo {
    serviceId: number,
    serviceName: string,
    serviceDescription: String,
    operations: JGSOperationInfo[]
}

