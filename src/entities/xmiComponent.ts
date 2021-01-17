import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {Reference} from "../types/reference";
import {xmiInterface} from "./xmiInterface";
import xmiBase from "./xmiBase";
import {xmiProvided} from "./component/xmiProvided";
import {xmiRequired} from "./component/xmiRequired";
import {xmiAbstractClass} from "../base/xmiAbstractClass";
import {xmiAggregationLink} from "./links/xmiAggregationLink";
import xmiConnector from "./connectors/xmiConnector";
import {xmiInOut} from "./component/xmiInOut";
import {xmiClass} from "./xmiClass";

export class xmiComponent extends xmiAbstractClass {
    provided: xmiProvided[] = [];
    required: xmiRequired[] = [];
    connectors: xmiConnector[] = [];

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);
        this.refreshComponent(raw);
    }

    refreshComponent(raw: any, parent?: xmiPackage) {
        super.refresh(raw, parent);

        if(raw.links && raw.links.length && raw.links[0].Sequence) {
            this.links.sequence = raw.links[0].Sequence.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(raw.links && raw.links.length && raw.links[0].Usage) {
            this.links.usage = raw.links[0].Usage.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(raw.provided) {
            this.provided = raw.provided.map((x: any) => xmiComponentFactory.registerProvide(x, this));
        }

        if(raw.required) {
            this.required = raw.required.map((x: any) => new xmiRequired(x, this));
        }

        if(raw.ownedConnector) {
            this.connectors = raw.ownedConnector.map((x: any) => xmiComponentFactory.getConnectorByKey(x.$['xmi:id']));

            // connector source/target not yet fully initialized
            xmiComponentFactory.registerPostCallback(() => {
                this.connectors.forEach(x => {
                    this.required.push(this.createDependencyLinkByConnector(x, parent));
                    (<xmiComponent>x.target.typeRef).provided.push(this.createDependencyLinkByConnector(x, parent));
                });
            });
        }
    }

    get references(): Reference {
        const imports = super.references;

        this.provided.forEach(value => {
            if(value.name) {
                imports['../' + this.getRelativePath(<xmiInterface>value.typeRef) + '/contracts/' + value.name] = value.namePascal + 'Contract';

                const ref = <xmiInterface>value.typeRef;
                (ref.attributes || []).filter(x => x.typeRef).forEach(attribute => {
                    const typeRef = <xmiBase>attribute.typeRef;
                    imports['../' + this.getRelativePath(typeRef) + '/contracts/' + typeRef.name] = typeRef.namePascal  + 'Contract';
                });
            }
        });

        this.required.forEach(value => {
            const typeRef = <xmiInterface>value.typeRef;
            imports['../' + this.getRelativePath(typeRef) + '/contracts/' + typeRef.name] = typeRef.namePascal + 'Contract';
        });

        return imports;
    }

    toConsole() {
        const ret: any = super.toConsole();
        const key: string = Object.keys(ret)[0];

        this.required && (ret[key].required = this.required.map(x => x.name));
        this.provided && (ret[key].provided = this.provided.map(x => x.name));
        this.connectors && (ret[key].connectors = this.connectors.map(x => x.id));

        return ret;
    }

    private createDependencyLinkByConnector(connector: xmiConnector, parent: xmiPackage | undefined): xmiRequired {
        const typeRef = <xmiClass>connector.target.typeRef;
        const identifiers = {$: { 'xmi:id': typeRef.id, 'xmi:idref': typeRef.id }};
        const dep = new xmiRequired(identifiers, this);

        dep.typeRef = <xmiInterface>connector.target.typeRef;
        dep.linkRef = new xmiInOut(identifiers, parent);
        dep.linkRef.owner = this;
        dep.linkRef.ref = <xmiBase>connector.target.typeRef;

        return dep;
    }
}
