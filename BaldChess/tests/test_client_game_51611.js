'use strict';
// Clicking ANY friendly piece cancels a queued premove and selects that piece.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'), memory=new Map();
const board=Array.from({length:8},()=>Array(8).fill(null));
board[1][4]={type:'P',color:'yellow',moved:false};
board[1][3]={type:'P',color:'yellow',moved:false};
board[6][4]={type:'P',color:'red',moved:false};
let moves=0;
const room={code:'ABCDEF',role:'yellow',revision:1,seats:{yellow:'Guest',red:'Host'},offline:{yellow:false,red:false},host_controls:[],state:{status:'playing',turn:'red',board,options:{mode:'duel',premoves:true},active:{red:true,yellow:true},move_count:0}};
const ctx={console,Promise,Date,URL,location:{href:'http://localhost/?room=ABCDEF'},history:{replaceState(){}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},fetch:async (url,init={})=>{
 const ok=x=>({ok:true,json:async()=>x});
 if(url.endsWith('/legal')){const [r,c]=JSON.parse(init.body).from;return ok({moves:[[r+1,c],[r+2,c]]});}
 if(url.endsWith('/move')){moves++;throw Error('Premoves must not send until it is our turn');}
 return ok(room);
},window:{ChessUI:{promotion:async()=> 'Q'}}};
vm.createContext(ctx);
for(const name of ['board.js','game.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',name),'utf8'),ctx);
const game=vm.runInContext('ChessGame',ctx);
(async()=>{
 await game.openRoom('ABCDEF');
 await game.choose(1,4);await game.choose(2,4);
 assert(game.get().premove,'premove queued');
 await game.choose(1,3);
 assert.equal(game.get().premove,null,'click on another friendly pawn cancels original premove');
 assert.equal(game.get().selected.c,3,'new pawn is selected on same click');
 await game.choose(2,3);
 assert.deepEqual(Array.from(game.get().premove.from),[1,3]);
 // Clicking the original pawn should cancel the new pawn's premove as well.
 await game.choose(1,4);
 assert.equal(game.get().premove,null);
 assert.equal(game.get().selected.c,4);
 await game.choose(2,4);
 assert(game.get().premove);
 // Clicking an empty square should not cancel a queued premove.
 await game.choose(5,5);
 assert(game.get().premove,'empty-square click does not cancel premove');
 assert.equal(moves,0,'no server move was sent');
 console.log('5.16.11: any-own-piece premove cancellation and instant reselection PASS');
})().catch(err=>{console.error(err);process.exitCode=1});
