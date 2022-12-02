import { User } from "../security/user";

export interface ModuleConfiguration {
    moduleConfigurationId   :   number;
    name                    :   string;
    type                    :   string;
    value                   :   string;
    module                  :   string;
    lastChangeMC            :   Date;
    rowVersionMC            :   number;
    lastUserChangeMC        :   User;
}
