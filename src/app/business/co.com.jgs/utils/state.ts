import { Country } from "./country";
import { StatePK } from "./state-pk";

export interface State {
    statesPK    :   StatePK;
    stateName   :   string;
    countries   :   Country;
}