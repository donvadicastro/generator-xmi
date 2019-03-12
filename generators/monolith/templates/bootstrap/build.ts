import s from 'shelljs';
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

s.rm('-rf', outDir);
s.mkdir(outDir);
s.mkdir('-p', `${outDir}/api/public`);

s.cp('.env', `${outDir}/.env`);
s.cp('-r', 'api/public', `${outDir}/api`);
s.mkdir('-p', `${outDir}/api/server/swagger/swagger`);
s.cp('api/server/swagger/api.yaml', `${outDir}/api/server/swagger/api.yaml`);