"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const pkg = require('../package.json');
const ormConfig = require('../ormconfig.json');
const path = require('path');
const fs = require('fs');
class DatabaseUtils {
    /**
     * Preload data.
     */
    static preload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDefaultConnection();
            yield this.cleanAll();
            yield this.loadAll();
        });
    }
    /**
     * Create default connection
     */
    static createDefaultConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.createConnection(Object.assign({}, pkg.db, ormConfig));
        });
    }
    /**
     * Returns the entites of the database
     */
    static getEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield typeorm_1.getConnection();
            const metadatas = connection.entityMetadatas;
            const entities = this.sort(metadatas).map((x) => ({ name: x.name, tableName: x.tableName }));
            return entities;
        });
    }
    /**
     * Cleans all the entities
     */
    static cleanAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const entity of yield this.getEntities()) {
                try {
                    const repository = yield typeorm_1.getRepository(entity.name);
                    yield repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
                    yield repository.query(`SELECT setval(pg_get_serial_sequence('${entity.tableName}', 'id'), 1);`);
                }
                catch (error) {
                    throw new Error(`ERROR: Cleaning test db error on "${entity.tableName}" table: ${error}`);
                }
            }
        });
    }
    /**
     * Insert the data from the src/test/fixtures folder
     */
    static loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const entity of yield this.getEntities()) {
                try {
                    const repository = yield typeorm_1.getRepository(entity.name);
                    const fixtureFile = path.join(__dirname, `../test/fixtures/${entity.name}.json`);
                    if (fs.existsSync(fixtureFile)) {
                        const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
                        for (let i = 0; i < items.length; i++) {
                            //make sequential insert to ensure all referenced entities are 
                            //created in scope of single insert on parent entity too.
                            yield repository.createQueryBuilder(entity.name).insert().values(items[i]).execute();
                        }
                    }
                }
                catch (error) {
                    throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixture "${entity.name}" on test db: ${error.message} on query "${error.query}"`);
                }
            }
        });
    }
    static sort(metadatas) {
        const returns = [];
        while (metadatas.length) {
            // extract with no references
            metadatas = metadatas.filter(x => {
                if (!x.columns.some(y => {
                    const meta = y.relationMetadata;
                    return meta && (meta.isOneToOne || meta.isManyToOne);
                })) {
                    returns.push(x);
                    return false;
                }
                return true;
            });
            // extract with existing references
            metadatas = metadatas.filter(x => {
                if (x.columns.filter(x => {
                    const meta = x.relationMetadata;
                    return meta && (meta.isOneToOne || meta.isManyToOne) && !meta.isNullable;
                }).every(x => returns.some(y => y.target === x.relationMetadata.type))) {
                    returns.push(x);
                    return false;
                }
                return true;
            });
        }
        return returns;
    }
}
exports.DatabaseUtils = DatabaseUtils;
//# sourceMappingURL=database.js.map