import {createConnection, EntityMetadata, getConnection, getRepository} from "typeorm";
import {camelCase} from "typeorm/util/StringUtils";
import {RelationMetadata} from "typeorm/metadata/RelationMetadata";

const pkg = require('../package.json');
const ormConfig = require('../ormconfig.json');
const path = require('path');
const fs = require('fs');

export class DatabaseUtils {
    /**
     * Preload data.
     */
    static async preload() {
        await this.createDefaultConnection();
        await this.cleanAll();
        await this.loadAll();
    }

    /**
     * Create default connection
     */
    static async createDefaultConnection() {
        await createConnection({...pkg.db, ...ormConfig});
    }

    /**
     * Returns the entites of the database
     */
    static async getEntities() {
        const connection = await getConnection();
        const metadatas = connection.entityMetadatas;
        const entities = this.sort(metadatas).map((x: EntityMetadata) => ({name: x.name, tableName: x.tableName}));

        return entities;
    }

    /**
     * Cleans all the entities
     */
    static async cleanAll() {
        for (const entity of await this.getEntities()) {
            try {
                const repository = await getRepository(entity.name);
                await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
                await repository.query(`SELECT setval(pg_get_serial_sequence('${entity.tableName}', 'id'), 1);`);
            } catch (error) {
                throw new Error(`ERROR: Cleaning test db error on "${entity.tableName}" table: ${error}`);
            }
        }
    }

    /**
     * Insert the data from the src/test/fixtures folder
     */
    static async loadAll() {
        for (const entity of await this.getEntities()) {
            try {
                const repository = await getRepository(entity.name);
                const fixtureFile = path.join(__dirname, `../test/fixtures/${entity.name}.json`);

                if (fs.existsSync(fixtureFile)) {
                    const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));

                    for (let i = 0; i < items.length; i++) {
                        //make sequential insert to ensure all referenced entities are 
                        //created in scope of single insert on parent entity too.

                        await repository.createQueryBuilder(entity.name).insert().values(items[i]).execute();
                    }
                }
            } catch (error) {
                throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixture "${entity.name}" on test db: ${error.message} on query "${error.query}"`);
            }

        }
    }

    private static sort(metadatas: EntityMetadata[]): EntityMetadata[] {
        const returns: EntityMetadata[] = [];

        while (metadatas.length) {
            // extract with no references
            metadatas = metadatas.filter(x => {
                if(!x.columns.some(y => y.propertyName.endsWith('Ref'))) {
                    returns.push(x);
                    return false;
                }

                return true;
            });

            // extract with existing references
            metadatas = metadatas.filter(x => {
                if(x.columns.filter(x => x.propertyName.endsWith('Ref') && !(<RelationMetadata>x.relationMetadata).isNullable).map(x => x.propertyName)
                    .every(x => returns.map(y => camelCase(y.name + 'Ref')).some(y => y === x))) {

                    returns.push(x);
                    return false;
                }

                return true;
            });
        }

        return returns;
    }
}
