export interface LicenseUpdateInput {
    licenseIdToUpdate   : string,
    daysOfValidity      : number,
    autoRenoval         : number,
    companyId           : number,
    startDate           : Date
}
