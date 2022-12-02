import { Messages } from "../../../../co.com.jgs/system/messages";

export interface JGSExpiredPasswordOutput {
    objectToReturn: any;
    messageResponse: Messages;
    errorMessages: String [];
    success: boolean;
    daysToExpired: number;
    expired: boolean;
}

