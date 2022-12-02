import { CatalogPK } from "./catalog-pk";

export interface Catalog {
    catalogsPK          :   CatalogPK;
    item                :   string;
    description         :   string;
    status              :   number;
    lastChangeCatalog   :   Date;
    rowVersionCatalog   :   number;
}
