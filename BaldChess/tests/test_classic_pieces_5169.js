const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'js/pieces.js'),'utf8');
const ctx={document:{createElement:()=>({className:'',innerHTML:''})}};
vm.runInNewContext(raw+'\nthis.CP=ChessPieces;',ctx);
const faces=[['red','#ffffff','w'],['yellow','#101010','b'],['blue','#215c99','b'],['green','#73b680','w']];
for(const kind of 'KQBNRP'){
 const seen=new Set();
 for(const [owner,paint,side] of faces){
   const el=ctx.CP.get(kind,'classic',owner,paint);
   assert(el.className.includes('art-classic'));
   assert(el.innerHTML.includes('viewBox="0 0 45 45"'));
   assert(el.innerHTML.includes((side==='w'?'white-':'black-')+({K:'king',Q:'queen',B:'bishop',N:'knight',R:'rook',P:'pawn'})[kind]));
   assert(!el.innerHTML.includes('<image')&&!el.innerHTML.includes('data:image'));
   if(side==='w'&&paint==='#ffffff'||side==='b'&&paint==='#101010'){
     const file=fs.readFileSync(path.join(root,'assets/classic-figures',side+kind+'.svg'),'utf8');
     assert(el.innerHTML.includes(file.slice(file.indexOf('<g '),file.lastIndexOf('</svg>'))));
   } else assert(el.innerHTML.includes(paint), `${kind} fails to use ${paint}`);
   seen.add(el.innerHTML);
 }
 assert.equal(seen.size,4);
 assert(ctx.CP.get(kind,'dragons','red').innerHTML.includes('<svg'));
}
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('js/pieces.js?v=51615'));
console.log('Cburnett pieces: 12 originals and 4 color palettes PASS');
