// Updated classic pieces contract for 5.16.10: native SVG and palette-aware colors.
const vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js/pieces.js'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ctx={document:{createElement(){return {className:'',innerHTML:''};}}};
vm.createContext(ctx);vm.runInContext(source+'\nthis.Pieces=ChessPieces;',ctx);
const faces=[['red','#ffffff'],['yellow','#101010'],['blue','#215c99'],['green','#73b680']];
for(const kind of 'KQBNRP'){
 const results=new Map();
 for(const [owner,color] of faces){
  const {className,innerHTML}=ctx.Pieces.get(kind,'classic',owner,color);
  assert(className.includes('art-classic'));
  assert(innerHTML.includes('<svg viewBox="0 0 128 128"'));
  assert(innerHTML.includes(`fill="${color}"`),`${kind}/${owner} did not use its theme fill ${color}`);
  assert(innerHTML.includes('stroke="#111111"'));
  assert(!innerHTML.includes('data:image/png')&&!innerHTML.includes('<image'));
  assert(!innerHTML.includes('@F@')&&!innerHTML.includes('@D@'));
  results.set(owner,innerHTML);
 }
 assert.notEqual(results.get('red'),results.get('yellow'),'White/black chessmen have same SVG');
 assert.notEqual(results.get('blue'),results.get('green'),'Blue/green chessmen have same SVG');
 // The selected palette also controls colors that are not one of the four defaults.
 assert(ctx.Pieces.get(kind,'classic','red','#e25e58').innerHTML.includes('fill="#e25e58"'));
 // The other nonclassic artworks must still work unchanged.
 assert(ctx.Pieces.get(kind,'dragons','red').innerHTML.includes('<svg'));
 for(const [prefix,owner,paint] of [['w','red','#ffffff'],['b','yellow','#101010']]){
  const file=fs.readFileSync(path.join(root,'assets/classic-figures',prefix+kind+'.svg'),'utf8');
  assert.equal(file,ctx.Pieces.get(kind,'classic',owner,paint).innerHTML);
 }
}
assert(app.includes('ChessPieces.get(p.type,skin,p.color,color)'));
assert(html.includes('js/pieces.js?v=51611'));
assert(html.includes('js/app.js?v=51611'));
console.log('5.16.10: 12 SVG icons, 4 seats, theme-driven color + cache bust PASS');
