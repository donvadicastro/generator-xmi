Bootstrap complete solution from your UML diagram created in "Enterprise Architect". 

Once bootstrapped - implement required business behaviors for defined actions and that's it. As an results - you will receive complete web application with attached REST API server and Postgres DB storage with created scheme.

The fastest solution to prototype architecture design. Build with TypeScript, NodeJs and Express. Follow [WIKI for more details](https://github.com/donvadicastro/generator-xmi/wiki).

## Usage
Install yo and generator-xmi:

```
npm install -g yo generator-xmi
```

## Generate project
#### Call generator with default options
```
yo xmi <file-path>
```

* "**file-path**" is the path to XMI file and is required option. An error will be thrown when file path not specified.

Next options will be applied by default:
* "**type**" (default is "monolith") - type of project hat will be generated
* "**destination**" (default is "dist") - path, relative to current dir, where project will be generated

## Generated project
### File and directory structure
* "**app**" - contains generated SPA to be used to connect to generated REST API
* "**api**" - contains all necessary files to start project as local web service
* "**cmd**" - contains set of executable commands to execute repetative actions
* "**design**" - contains all EA-related generated files and artifacts: classes, components, diagrams implementation, etc
* "**utils**" - project specific utilities

### Build-in commands
Each generated sequence diagrams can be represented as individual API endpoint so can be triggered by any REST client or from bound Swagger client. Swagger is also added as part of generated project.

Next command will be available after project generation:
* "**api:start**" - start local web server
* "**app:start**" - run local application
* "**all:docker:run**" - run all integrated environment in docker


### Start local web server
Navigate to "[http://localhost:3000/api-explorer](http://localhost:3000/api-explorer)" to run local Swagger.
