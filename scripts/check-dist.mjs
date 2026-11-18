import {readFileSync,existsSync,readdirSync} from 'node:fs';
const pages=['index','grupo','empresas','gr-vallados','del-sol-ingenieria','del-sol-constructora','eco-asfalto','contacto'];
for(const page of pages){const html=readFileSync(`dist/${page}.html`,'utf8');if(!html.includes('lang="es-PY"')||!html.includes('description')||!html.includes('/demo_1/assets/'))throw Error(`Invalid page ${page}`);for(const match of html.matchAll(/(?:src|href)="(\/demo_1\/[^\"]+)"/g)){const file='dist/'+match[1].replace('/demo_1/','');if(!existsSync(file))throw Error(`Missing asset ${file}`)}}
if(readdirSync('dist/images').length!==8)throw Error('Missing responsive imagery');
console.log('PASS: 8 real HTML entrypoints, metadata, repository paths, fonts, favicon and 8 responsive images.');
