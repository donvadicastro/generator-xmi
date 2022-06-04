"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actors = require("comedy");
class ActorSystemFactory {
    static get() {
        return this.actorSystem;
    }
}
ActorSystemFactory.actorSystem = actors({ mode: 'in-memory' }); //in-memory, forked
exports.default = ActorSystemFactory;
//# sourceMappingURL=actors.js.map