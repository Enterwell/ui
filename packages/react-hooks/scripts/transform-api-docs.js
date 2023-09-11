import {readFileSync, writeFileSync} from 'fs';

const apiContent = readFileSync('./dist/react-hooks.api.json');
const api = JSON.parse(apiContent);
writeFileSync('./dist/api.js', "const api = " + JSON.stringify(api) + "; export default api;", 'utf8');

const packageContent = readFileSync('./package.json');
const packageObj = JSON.parse(packageContent);
writeFileSync('./dist/package.js', "const packageObj = " + JSON.stringify(packageObj) + "; export default packageObj;", 'utf8');