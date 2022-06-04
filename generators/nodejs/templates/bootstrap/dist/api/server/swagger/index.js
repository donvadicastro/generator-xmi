"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_express_middleware_1 = __importDefault(require("swagger-express-middleware"));
const path_1 = __importDefault(require("path"));
function default_1(app, routes) {
    swagger_express_middleware_1.default(path_1.default.join(__dirname, 'api.yaml'), app, function (err, middleware) {
        // Enable Express' case-sensitive and strict options
        // (so "/entities", "/Entities", and "/Entities/" are all different)
        app.enable('case sensitive routing');
        app.enable('strict routing');
        //Annotates each request with all the relevant information from the Swagger definition.
        //The path, the operation, the parameters, the security requirements - they’re all easily accessible at req.swagger.
        //app.use(middleware.metadata());
        app.use(middleware.files(app, {
            apiPath: process.env.SWAGGER_API_SPEC,
        }));
        app.use(middleware.parseRequest({
            // Configure the cookie parser to use secure cookies
            cookie: {
                secret: process.env.SESSION_SECRET
            },
            // Don't allow JSON content over 100kb (default is 1mb)
            json: {
                limit: process.env.REQUEST_LIMIT
            }
        }));
        // These two middleware don't have any options (yet)
        app.use(middleware.CORS(), middleware.validateRequest());
        // Error handler to display the validation error as HTML
        app.use(function (err, req, res, next) {
            res.status(err.status);
            res.send('<h1>' + err.status + ' Error</h1>' +
                '<pre>' + err.message + '</pre>');
        });
        routes(app);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map