import {ActorSystem} from "comedy";
const actors = require("comedy");

export default class ActorSystemFactory {
    static actorSystem: ActorSystem = actors({mode: 'in-memory'}); //in-memory, forked

    static get() {
        return this.actorSystem;
    }
}
