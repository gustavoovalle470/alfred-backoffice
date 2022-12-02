import { License } from "./license";

export interface Module {
    moduleId            :   string;
    name                :   string;
    descripcion         :   string;
    active              :   number;
    lastChange          :   Date;
    rowVersion          :   number;
    licenses            :   License[];
}