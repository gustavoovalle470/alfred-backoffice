import { Catalog } from "../system/catalog";
import { User } from "./user";

export interface UserData {
    username        :   string;
    name            :   string;
    surname         :   string;
    document        :   string;
    email           :   string;
    phone           :   string;
    address         :   string;
    lastChange      :   Date;
    rowVersion      :   number;
    gender          :   Catalog;
    documentType    :   Catalog;
    users           :   User;
}
