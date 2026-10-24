const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'js/pieces.js'),'utf8');
const context={document:{createElement:()=>({className:'',innerHTML:''})}};
vm.runInNewContext(js+'\nthis.CP=ChessPieces;',context);
for(const kind of 'KQBNRP'){
 for(const [paint,code] of [['#ffffff','w'],['#101010','b']]){
  const dom=context.CP.get(kind,'classic','red',paint);
  const src=fs.readFileSync(path.join(root,'assets/classic-figures',code+kind+'.svg'),'utf8');
  assert(dom.innerHTML.includes(src.match(/<g [\s\S]*<\/g>/)?.[0]||''),kind+code+' runtime mismatch');
  assert(dom.innerHTML.includes('viewBox="0 0 45 45"'),kind+code+' incorrect SVG');
 }
}
const rook=fs.readFileSync(path.join(root,'assets/classic-figures/bR.svg'),'utf8');
assert(rook.includes('fill="#000"') && rook.includes('stroke="#fff"'));
console.log('Cburnett: 12 transparent SVG pieces match their runtime artwork.');
