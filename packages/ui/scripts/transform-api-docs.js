import {readFileSync, writeFileSync} from 'fs';

const apiContent = readFileSync('./dist/ui.api.json');
const api = JSON.parse(apiContent);
writeFileSync('./dist/api.js', "const api = " + JSON.stringify(api) + "; export default api;", 'utf8');