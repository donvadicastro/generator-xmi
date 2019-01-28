## Generate solution
#### Call generator with default options
```
yo xmi <file-path>
```

"**<file-path>**" is the path to XMI file and is required option. An error will be thrown when file path not specified.

Next options will be applied by default:

- destination: **dist**
- type: **monolith**

#### Call generator with options
```
yo xmi <file-path> --destination=<destination-path> --type=<type>
```

where "type" can be next:

- **monolith** - default when not specified and generates project as monolith "node"-based application
- **microservices** - generates set of individual actors

## Generation examples
### Class generation
![class diagrams](./assets/wiki/images/class.png)

bulding
```typescript
import { buildingBase } from './generated/building.generated';

export class building extends buildingBase {
    //override base actions to implement own business behaviors
    build(state: any): Promise < any > {
        return super.build(state);
    }
}
```

building.generated
```typescript
export abstract class buildingBase extends ComponentBase implements buildingContract {
    code: number = 0;

    constructor() {
        super();
    }

    build(state: any): Promise < any > {
        ...
    }
}
```

building.contract
```typescript
export interface buildingContract {
    code: number;

    build(state: any): Promise < any > ;
}
```

### Interface generation
**Important!!!** Interface properties are not reflected in object that it implement. Only methods.

![interface generation](./assets/wiki/images/interface.png)

A
```typescript
import { aBase } from './generated/a.generated';

export class a extends aBase {
}
```

A.generated
```typescript
export abstract class aBase extends ComponentBase implements aContract {
    ...
    
    fn1(state: any): Promise < any > {
        ...
    }
    
    fn2(state: any): Promise < any > {
        ...
    }
}
```

A.contract
```typescript
export interface aContract {
    fn1(state: any): Promise < any > ;
    fn2(state: any): Promise < any > ;
}
```

B.contract
```typescript
/**
 * This file is auto-generated. Do not update it's content!
 */
export interface bContract {
    attr1: number;
    attr2: boolean;
    
    fn1(state: any): Promise < any > ;
    fn2(state: any): Promise < any > ;
}
```

### Component generation
![interface generation](./assets/wiki/images/component.png)

C1
```typescript
import { c1Base } from './generated/c1.generated';

export class c1 extends c1Base {}
```

C1.generated

* input interfaces will be transformed into component constructor injected property
* output interfaces will be transformed into component public methods

```typescript
export abstract class c1Base extends ComponentBase implements c1Contract, outContract, out2Contract {
    // component own property
    attr1: number = 0;

    // constructor injected IN interface
    constructor(protected in: inContract) {
        super();
    }
    
    // component own method
    fn1(state: any): Promise < any > {
        ...
    }

    // output defined interface methods
    outFn(state: any): Promise < any > {
        ...
    }
}
```

C2.generated

* input interfaces will be transformed into component constructor injected property
* output interfaces will be transformed into component public methods

```typescript
export abstract class c2Base extends ComponentBase implements c2Contract, inContract {
    constructor(protected out: outContract) {
        super();
    }

    inFn(state: any): Promise < any > {
        ...
    }
}
```

In.interface
```typescript
export interface inContract {
    inFn(state: any): Promise < any > ;
}
```

Out.interface
```typescript
export interface outContract {
    outFn(state: any): Promise < any > ;
}
```