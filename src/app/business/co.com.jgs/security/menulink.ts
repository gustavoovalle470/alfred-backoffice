import { Module } from "../subscription/module";
import { User } from "./user";

export interface Menulink {
    menuName                :   string,
    module                  :   Module,
    node                    :   string,
    status                  :   number,
    link                    :   string,
    iconExpression          :   string,
    lastChangeMenuLinks     :   Date,
    rowVersionMenuLinks     :   number,
    lastUserChangeMenuLinks :   User
}
