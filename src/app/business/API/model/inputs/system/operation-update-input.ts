export interface OperationUpdateInput {
    operationId :number,
    serviceId   :number,
    name        :string,
    description :string,
    status      :number,
    controller  :string,
    version     :string,
    operation   :string,
    auditable   :number
}
