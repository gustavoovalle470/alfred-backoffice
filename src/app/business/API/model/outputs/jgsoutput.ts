import { Messages } from "../../../co.com.jgs/system/messages";

export interface JGSOutput {
    objectToReturn: any;
    messageResponse: Messages;
    errorMessages: string [];
    success: boolean;
}

