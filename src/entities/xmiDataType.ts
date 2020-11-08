import {xmiInterface} from "./xmiInterface";
import {Reference} from "../types/reference";
import {IAttribute} from "../contracts/attribute";

export class xmiDataType extends xmiInterface {
    get references(): Reference {
        const imports: any = {};

        //Inject attributes type
        this.attributes.forEach(attribute => {
            if(attribute.typeRef) {
                imports[this.getRelativePath(attribute.typeRef) +
                (attribute.isEnum ? '/enums/' : (attribute.isDataType ? '/types/' : '/components/')) + attribute.typeRef.name] =
                    attribute.typeRef.namePascal;
            }
        });

        return imports;
    }

    /**
     * Get all attributes that are used to edit entity content (main usage is form editing).
     */
    get attributesCombinedToEdit(): IAttribute[] {
        return this.attributes;
    }
}
