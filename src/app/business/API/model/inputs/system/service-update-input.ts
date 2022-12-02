export interface ServiceUpdateInput {
    serviceId       : number,
    serviceStatus   : number,
    name            : string,
    host            : string,
    port            : string,
    path            : string,
    description     : string,
    moduleId        : string
}
