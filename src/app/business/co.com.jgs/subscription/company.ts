import { City } from "../utils/city";

export interface Company {
    companyId           :   number;
    name                :   string;
    mailAddress         :   string;
    contactEmail        :   string;
    contactPhone        :   string;
    principalCity       :   City;
    lastChange          :   Date;
    rowVersion          :   number;
}
