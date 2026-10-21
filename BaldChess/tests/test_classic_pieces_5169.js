// Classic SVG contract: twelve clean font-outline designs with fixed reference colors.
const vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert');
const code=fs.readFileSync(path.join(__dirname,'../js/pieces.js'),'utf8');
const context={document:{createElement(){return {className:'',innerHTML:''};}}};
vm.createContext(context);
vm.runInContext(code+'\nthis.Pieces=ChessPieces;',context);
for(const kind of 'KQBNRP'){
  const white=context.Pieces.get(kind,'classic','red');
  const black=context.Pieces.get(kind,'classic','yellow');
  const blue=context.Pieces.get(kind,'classic','blue');
  const green=context.Pieces.get(kind,'classic','green');
  assert(white.className.includes('art-classic'));
  assert(white.innerHTML.includes('viewBox="0 0 128 128"'));
  assert(white.innerHTML.includes('fill="#ffffff"'));
  assert(white.innerHTML.includes('fill="#111111"'));
  assert(black.innerHTML.includes('fill="#111111"'));
  assert(blue.innerHTML.includes('fill="#286cb0"'));
  assert(green.innerHTML.includes('fill="#90cda4"'));
  assert.notEqual(white.innerHTML,black.innerHTML);
  assert(context.Pieces.get(kind,'dragons','red').innerHTML.includes('<svg'));
}
const pawnBlack=context.Pieces.get('P','classic','yellow');
assert(!pawnBlack.innerHTML.includes('fill="#ffffff"'), 'Black pawn is fully filled, like source');
console.log('5.16.9 12 true-outline chess glyphs and 4-player color variants PASS');
