import { Company } from "../subscription/company";
import { Catalog } from "../system/catalog";

export interface User {
    username			:	string;
    password            :	string; 	
    lastPasswordChange  :	Date;	  
    lastLogin           :	Date;		
    triesToConnect      :	number;		
    userStatus          :	Catalog;
    companyId           :	Company; 	
    lastChangeUser      :	Date;
    rowVersionUser      :	number;		
}
