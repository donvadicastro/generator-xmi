const shell = require('shelljs');
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

shell.rm('-rf', outDir);
shell.mkdir(outDir);
shell.mkdir('-p', `${outDir}/api/public`);

shell.cp('.env', `${outDir}/.env`);
shell.cp('package.json', `${outDir}/package.json`);
shell.cp('ormconfig.json', `${outDir}/ormconfig.json`);
shell.cp('-r', 'api/public', `${outDir}/api`);
shell.mkdir('-p', `${outDir}/api/server/swagger/swagger`);
shell.cp('api/server/swagger/api.yaml', `${outDir}/api/server/swagger/api.yaml`);

shell.exec(`cd ${outDir} && tsc`);
