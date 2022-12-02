import { Module } from "../subscription/module";

export interface Service {
    id : number,
    name : string,
    description : string, 
    active: number,
    host: string,
    port: string,
    path: string,
    moduleId : Module;
}
