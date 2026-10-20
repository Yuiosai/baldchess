'use strict';
// Run with: node tests/test_client_game_516.js
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const memory=new Map();
let revision=1;
const board=Array.from({length:8},()=>Array(8).fill(null));
board[1][4]={type:'P',color:'yellow',moved:false};
board[6][4]={type:'P',color:'red',moved:false};
let sourceDelayed=false,releaseLegal=null,moveCalls=[];
let currentTurn='red';
const makeRoom=()=>({
 code:'ABCDEF',role:'yellow',revision,state:{
  status:'playing',turn:currentTurn,board,
  options:{mode:'duel',premoves:true},
  active:{red:true,yellow:true,blue:false,green:false},
  last_move:null,move_count:0,history:[],checks:{red:false,yellow:false}
 },seats:{red:'Host',yellow:'Guest'},host_controls:[],offline:{red:false,yellow:false}
});
const ctx={
 console,Promise,Date,URL,location:{href:'http://localhost/?room=ABCDEF'},
 history:{replaceState:()=>{}},
 localStorage:{getItem:key=>memory.get(key)||null,setItem:(key,val)=>memory.set(key,val)},
 fetch:async (url,init={})=>{
  const ok=data=>({ok:true,json:async()=>data});
  if(url.includes('/legal')){
   if(sourceDelayed){await new Promise(resolve=>{releaseLegal=resolve;});}
   return ok({moves:[[2,4],[3,4]],revision});
  }
  if(url.includes('/move')){moveCalls.push(JSON.parse(init.body));return ok({room:makeRoom()});}
  return ok(makeRoom());
 },
 window:{ChessUI:{promotion:async()=> 'Q',toast:()=>{throw Error('Premove should be silent')},t:key=>key}},
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/board.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/game.js'),'utf8'),ctx);
(async()=>{
 const game=vm.runInContext('ChessGame',ctx);
 await game.openRoom('ABCDEF');
 assert.equal(game.get().room.role,'yellow');
 // Do not toast when a move is queued; only target is retained.
 await game.choose(1,4);
 assert.equal(game.get().selected.r,1);
 await game.choose(2,4);
 assert.equal(game.get().premove.to[0],2);
 assert.equal(game.get().selected,null);
 // Right click resets the pending premove and selected state.
 game.cancelInteraction();
 assert.equal(game.get().premove,null);
 assert.equal(game.get().selected,null);
 // A delayed legal reply cannot reselect the piece after a right-click cancel.
 sourceDelayed=true;
 const selection=game.choose(1,4);
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(typeof releaseLegal,'function');
 game.cancelInteraction();releaseLegal();
 await selection;
 assert.equal(game.get().selected,null);
 sourceDelayed=false;
 await game.choose(1,4);
 await game.choose(2,4);
 assert.ok(game.get().premove);
 // Updating room to yellow's turn executes one valid premove.
 currentTurn='yellow';revision++;
 await game.poll();
 await new Promise(resolve=>setTimeout(resolve,15));
 assert.equal(moveCalls.length,1);
 assert.equal(game.get().premove,null);
 console.log('CLIENT TESTS PASSED: queue, silence, cancel, stale selection, execution');
})().catch(err=>{console.error(err);process.exitCode=1;});
