import { License } from "../subscription/license";
import { Session } from "./session";

export interface SessionData {
    session     : Session;
    license     : License;
}
