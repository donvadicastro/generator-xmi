## Prerequisites for client
* install "[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)" client
* install "[NodeJS](https://nodejs.org)" LTS version

#### install dependencies through command line 
```
#install choco
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

#install NodeJS
choco install nodejs-lts

#install Git
choco install git
```

## Download project
```
git clone https://github.com/donvadicastro/exchange-connector.git
cd exchange-connector
```

## Prerequisites for local kafka (if needed)
* install [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)

## Prerequisites for Raspberry
* initialize
```
./scripts/raspberry-init.sh
```

## Windows installation
* install [Microsoft build tools](http://www.microsoft.com/en-us/download/details.aspx?id=40760)
* run PowerShell console with admin rights 
```
npm install --global --production windows-build-tools
npm config set msvs_version 2017 --global
npm install
```

## Linux installation
```
npm install
```

## Run local kafka
* open "Docker terminal"
* run "`./scripts/run-kafka.sh`" script
* do not close terminal

## Description
This project aims on creation of integration bridge to help execute financial operation 
with different clients based on action type involved.

Solution was developed using message-driven architecture, 
so all communications fulfilled through Kafka message bus.

This particular project was used to define and develop thin clients 
that will be responsible to process business events.

## Start client
```
npm start
```

## Test client
```
npm test
```

### Generate new worker
Worker is an nodeJS client that is connected to particular message queue and execute defined action based on
defined instruction.

To simplify worker creation it can be generated using inbound code generator. Run instructions below to generate new worker:

```
npm link
npm run generator:actor
```

This command will bootstrap new worker and print to console all files that were generated. 
Developer need to review generated files and provide required business behaviors.   

**Important**: by default all generated files are not automatically added to source control so need manually be added while committing. 

### Run single worker
Each individual worker can be run as singleton process or can be run suite of actors when necessary.
To run worker individually:

```
npm run actor <categoryName>/<actorName>
```


### Create message contract
Initially contract of input message should be defined. All message contract are placed in "contracts/messages" folder
and are represented as TypeScript interface.

Example:
```typescript
import {IMessageBase} from "./baseMessage";

export interface ICreateOrderMessage extends IMessageBase {
    symbol: string;
    type: 'market' | 'limit';
    side: 'buy' | 'sell';
    amount: number;
    price?: number;
    params?: {};
}
``` 

### Define worker
All executors are stored in "process" folder and are represented as TypeScript class inherited from "ExchangeConnectorProcessBase" base class.
Need to be implemented action that will be triggered on message.

To differentiate messages from different topics in single message handler - check `kafkaMessage.topic` value.

Example:
```typescript
import {ExchangeConnectorProcessBase} from "./base/processBase";
import {Message} from "kafka-node";

export class CreateOrder extends ExchangeConnectorProcessBase {
    constructor(kafkaClient: KafkaClientExt) {
        super(kafkaClient, null, [Topic.CREATE_ORDER_IN], Topic.CREATE_ORDER_OUT);
    }

    onMessage(message: ICreateOrderMessage, kafkaMessage: Message) {
        const exchange = this.getExchange(message.exchange);

        //handle invalid exchange properly
        if(!exchange) {
            return;
        }

        //check action is allowed on selected exchange
        if(!exchange.has['createMarketOrder']) {
            return this.kafkaClient.sendError(`"createMarketOrder" is not supported on "${message.exchange}"`);
        }

        console.log(`Order to be created on "${message.exchange}" with params: ${JSON.stringify(message)}`);
        exchange.createOrder(message.symbol, message.type, message.side, message.amount, message.price, message.params)
            .then((data: any) => this.send(data), (error: any) => this.sendError(error));
    }
}
```

### Add worker to pipeline
Once executor is created - it need to be registered in execution pipeline to be available to handle input messages.
Registration should be added in "index.ts".

Example:
```typescript
const client: KafkaClientExt = new KafkaClientExt();

//create executor instance, when 
const createOrderProcess = new CreateOrder(client);

client.initialize().then(() => {
    //start executor to handle events
    createOrderProcess.run();
});
```

### Set access credentials
If actions are requires authentication - auth config for particular exchange need to be specified in "package.json" file
in "ccxt -> exchange" section. Example:
```json
"binance": {
    "apiKey": "key",
    "secret": "secret"
}
```

### Verification
To check that worker is available and processed events correctly, test message can be triggered:
```
node tests/sendMessage.js <topicName> <message>
```

when:
* topicName - name of the topic data will be posted to
* message - string representation of message payload in JSON format. 
Example: `"{\"exchange\": \"exmo\", \"symbol\": \"ZEC/USD\", \"type\": \"limit\", \"side\": \"buy\", \"amount\": 0.01, \"price\": 50}"`
