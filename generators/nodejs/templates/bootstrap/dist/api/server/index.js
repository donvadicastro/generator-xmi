"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const server_1 = __importDefault(require("./server"));
const routes_1 = __importDefault(require("./routes"));
exports.default = new server_1.default()
    .router(routes_1.default)
    .listen(parseInt(process.env.SERVER_PORT || '3000'));
//# sourceMappingURL=index.js.map