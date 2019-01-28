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
#### Class generation
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

#### Implementing interface generation
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