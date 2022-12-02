import { SessionPK } from "./session-pk";
import { User } from "./user";

export interface Session {
    sessionsPK  : SessionPK;
    startIn     : Date;
    users       : User;
}
