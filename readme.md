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

```typescript
// bulding
export class building extends buildingBase {
    //override base actions to implement own business behaviors
    build(state: any): Promise < any > {
        return super.build(state);
    }
}

// building.generated
export abstract class buildingBase extends ComponentBase implements buildingContract {
    code: number = 0;

    constructor() {
        super();
    }

    build(state: any): Promise < any > {
        ...
    }
}

// building.contract
export interface buildingContract {
    code: number;

    build(state: any): Promise < any > ;
}
```

### Interface generation
**Important!!!** Interface properties are not reflected in object that it implement. Only methods.

![interface generation](./assets/wiki/images/interface.png)

```typescript
// A
export class a extends aBase {
}

// A.generated
export abstract class aBase extends ComponentBase implements aContract {
    ...
    
    fn1(state: any): Promise < any > {
        ...
    }
    
    fn2(state: any): Promise < any > {
        ...
    }
}

// A.contract
export interface aContract {
    fn1(state: any): Promise < any > ;
    fn2(state: any): Promise < any > ;
}

// B.contract
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
![component generation](./assets/wiki/images/component.png)

* input interfaces will be transformed into component constructor injected property
* output interfaces will be transformed into component public methods

```typescript
// C1
export class c1 extends c1Base {}

// C1.generated
export abstract class c1Base extends ComponentBase implements ... {
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

// C2.generated
export abstract class c2Base extends ComponentBase implements c2Contract, inContract {
    constructor(protected out: outContract) {
        super();
    }

    inFn(state: any): Promise < any > {
        ...
    }
}

// In.interface
export interface inContract {
    inFn(state: any): Promise < any > ;
}

// Out.interface
export interface outContract {
    outFn(state: any): Promise < any > ;
}
```

### Components dependency generation
![components dependency generation](./assets/wiki/images/component-dep.png)

* `TelegramBot` and `StorageService` components depends on `ConfidurationService` component
* Dependent component is injected through component constructor
* Exposed interfaces are represented as component public methods 

ConfigurationService.generated
```typescript
// ConfigurationService.generated
export abstract class configurationServiceBase extends ComponentBase implements ... {
    constructor() { super(); }

    getConfig(state: any): Promise < any > { ... }
}

// StorageService.generated
export abstract class storageServiceBase extends ComponentBase implements ... {
    constructor(protected configure: configureContract) {
        super();
    }

    save(state: any): Promise < any > {
        ...
    }
}

// TelegramBot.generated
export abstract class telegramBotBase extends ComponentBase implements ... {
    constructor(protected configure: configureContract) {
        super();
    }

    onMessage(state: any): Promise < any > {
        ...
    }
}

// Configure.interface
export interface configureContract {
    getConfig(state: any): Promise < any > ;
}

// Persistense.interface
export interface persistenseContract {
    save(state: any): Promise < any > ;
}

// Notification.interface
export interface notificationContract {
    onMessage(state: any): Promise < any > ;
}
```

### Sequence diagram generation
![sequence diagram generation](./assets/wiki/images/sequence.png)

* `inputState` is an process initial data
* All actors injected into process through constructor injection
* Actions considered as async operations and returned `Promise`

```typescript
export class eaCollaboration1 {
    constructor(
        // Actor1
        private cmpactor1: actor1Contract,

        // C1
        private cmpc1: c1Contract,

        // C2
        private cmpc2: c2Contract) {}

    /**
    /* Execute process
    */
    run(inputState: any) {
        let flowAsync = Promise.resolve(inputState);

        // Configure state storage
        flowAsync = flowAsync.then((state: any) => {
            return storage.init( /* options ... */ );
        });

        // actor1 call c1
        flowAsync = flowAsync.then((state: any) => {
            return this.cmpc1.fn1(state);
        });

        // c1 call c2
        flowAsync = flowAsync.then((state: any) => {
            return this.cmpc2.fn2(state);
        });

        // c2 call c1
        flowAsync = flowAsync.then((state: any) => {
            return this.cmpc1.ret1(state);
        });

        return flowAsync.catch(x => console.log(chalk.red('ERROR: '), x));
    }
}
```

### UI iteractions generation
![UI generation](./assets/wiki/images/ui.png)

* Screen can be configured to execute instructions (designed as sequence diagram) when applied to action control (button)
* By default user input to start process can be obtained though CMD terminal

```typescript
//process.generated
export class iteraction {
    run() {
        const answers = inquirer.prompt([{
            type: 'checkbox',
            name: 'sex',
            message: 'Enter Sex',
            choices: ['male', 'female']
        }, {
            type: 'textbox',
            name: 'firstName',
            message: 'Enter first name'
        }, {
            type: '',
            name: 'lastName',
            message: 'Enter last name'
        }, ]);

        const collaboration0 = new eaCollaboration1(new comp1(), new comp2());
        collaboration0.run(answers);
    }
}

//sequence.generated
export class eaCollaboration1 {
    constructor(
        // Comp1
        private cmpcomp1: comp1Contract,

        // Comp2
        private cmpcomp2: comp2Contract) {}

    run(inputState: any) {
        let flowAsync = Promise.resolve(inputState);

        // Configure state storage
        flowAsync = flowAsync.then((state: any) => {
            return storage.init( /* options ... */ );
        });

        // Start call comp1
        flowAsync = flowAsync.then((state: any) => {
            return this.cmpcomp1.op1(state);
        });

        // comp1 call comp2
        flowAsync = flowAsync.then((state: any) => {
            return this.cmpcomp2.op2(state);
        });

        return flowAsync.catch(x => console.log(chalk.red('ERROR: '), x));
    }
}
```

![UI generation example](./assets/wiki/images/ui-example.png)