import { Company } from "./company";
import { Module } from "./module";

export interface License {
    id              :   string;
    start           :   Date;
    daysOfValidity  :   number;
    autoRenoval     :   number;
    lastChange      :   Date;
    modules         :   Module[];
    rowVersion      :   number;
    company         :   Company;
}
