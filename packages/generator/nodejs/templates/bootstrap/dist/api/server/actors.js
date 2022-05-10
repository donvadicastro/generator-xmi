"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actors = require("comedy");
class ActorSystemFactory {
    static get() {
        return this.actorSystem;
    }
}
exports.default = ActorSystemFactory;
ActorSystemFactory.actorSystem = actors({ mode: 'in-memory' }); //in-memory, forked
//# sourceMappingURL=actors.js.map