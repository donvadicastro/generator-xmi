import xmiBase from "../entities/xmiBase";

export interface IAttribute {
    name: string;
    type?: string;
    typeRef?: xmiBase;
    typeDefaultValue?: string;
    isArray: boolean;
    isParent?: boolean;
}
