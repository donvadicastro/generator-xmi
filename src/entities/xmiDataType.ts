import {xmiInterface} from "./xmiInterface";
import {Reference} from "../types/reference";
import {IAttribute} from "../contracts/attribute";
import {ArrayUtils} from "../utils/arrayUtils";
import xmiBase from "./xmiBase";

export class xmiDataType extends xmiInterface {
    get references(): xmiBase[] {
        const imports: any = super.references;

        //Inject attributes type
        this.attributes.forEach(attribute => attribute.typeRef && ArrayUtils.insertIfNotExists(attribute, imports));

        return imports;
    }

    /**
     * Get all attributes that are used to edit entity content (main usage is form editing).
     */
    get attributesCombinedToEdit(): IAttribute[] {
        return this.attributes;
    }
}
