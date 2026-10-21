// Server validates every move. No accounts: a private seat token is stored per room.
const ChessGame=(()=>{
 let room=null,token=null,selected=null,moves=[],premove=null,pending=false,selectionEpoch=0,polling=false;
 const listeners=[];
 const readStore=k=>{try{return localStorage.getItem(k);}catch{return null;}};
 const store=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 const onChange=fn=>listeners.push(fn);
 const notify=()=>listeners.forEach(fn=>fn(room,selected,moves,premove));
 const controlled=(color)=>room&&(color===room.role||(room.role==='red'&&room.host_controls.includes(color)&&room.offline[color]));
 const currentActor=()=>room?.state.turn&&controlled(room.state.turn)?room.state.turn:room?.role;
 function remember(){if(room){store('baldchess_last_room',room.code);if(token)store('baldchess_token_'+room.code,token);}}
 async function request(path,method='GET',data,authToken=token){
  const init={method,headers:{Accept:'application/json'}};
  if(authToken)init.headers['X-BaldChess-Token']=authToken;
  if(data!==undefined){init.headers['Content-Type']='application/json';init.body=JSON.stringify(data);}
  let response;try{response=await fetch(path,init);}catch{throw Error('Server connection lost');}
  let json;try{json=await response.json();}catch{throw Error('Invalid server response');}
  if(!response.ok)throw Error(json.error||'Server error');return json;
 }
 function setUrl(code){let url=new URL(location.href);if(code)url.searchParams.set('room',code);else url.searchParams.delete('room');history.replaceState(null,'',url);}
 function accept(next){
  if(!room||room.code!==next.code){selectionEpoch++;selected=null;moves=[];premove=null;}
  else if(next.revision!==room.revision){
   selectionEpoch++;selected=null;moves=[];
   if(next.state.move_count < room.state.move_count ||
      JSON.stringify(next.state.options)!==JSON.stringify(room.state.options))premove=null;
  }
  if(!room||room.code!==next.code||next.revision>=room.revision){
   const changed=!room||next.code!==room.code||next.revision!==room.revision||JSON.stringify(next.offline)!==JSON.stringify(room.offline);
   next.seenAt=Date.now();room=next;remember();if(changed)notify();
   if(premove&&room.role===room.state.turn&&room.state.status==='playing'&&!pending){
    const queued=premove;premove=null;notify();Promise.resolve().then(()=>sendMove(queued.from,queued.to,queued.promotion)).catch(()=>{}); // An invalid premove disappears silently.
   }
   if(room.state.status==='finished'||!room.state.active[room.role])premove=null;
  }
 }
 async function create(options,name){pending=true;try{let res=await request('/api/rooms','POST',{options,name},null);token=res.token;room=null;accept(res.room);setUrl(room.code);}finally{pending=false;}}
 async function join(code,name){pending=true;try{code=code.trim().toUpperCase();let res=await request('/api/rooms/'+code+'/join','POST',{name},readStore('baldchess_token_'+code));token=res.token;room=null;accept(res.room);setUrl(code);}finally{pending=false;}}
 async function openRoom(code){code=code.trim().toUpperCase();let saved=readStore('baldchess_token_'+code);let res=await request('/api/rooms/'+code,'GET',undefined,saved);if(res.role==='spectator'&&res.state.status==='waiting')return false;token=saved;room=null;accept(res);setUrl(code);return true;}
 async function bootstrap(){let param=new URL(location.href).searchParams.get('room');if(param){try{if(await openRoom(param))return {joined:true};}catch(e){return {error:e.message};}return {invite:param};}let prev=readStore('baldchess_last_room');if(prev){try{if(await openRoom(prev))return {joined:true};}catch{}}return {empty:true};}
 async function poll(){if(!room||pending||polling)return;const code=room.code;polling=true;try{const res=await request('/api/rooms/'+code);if(room&&room.code===code)accept(res);}catch{}finally{polling=false;}}
 async function sendMove(from,to,promotion='Q'){
  if(!room||pending)return;pending=true;try{let res=await request('/api/rooms/'+room.code+'/move','POST',{from,to,promotion});selected=null;moves=[];accept(res.room);}finally{pending=false;}
 }
 async function choose(r,c){
  if(!room||pending||room.state.status!=='playing'||room.role==='spectator')return;
  const state=room.state,myTurn=controlled(state.turn),canQueue=state.options.premoves&&state.active[room.role];
  if(!myTurn&&!canQueue)return;
  const piece=state.board[r]?.[c];
  // Selecting the same source again cancels a queued premove, then allows a new one.
  if(premove&&premove.from[0]===r&&premove.from[1]===c){
   premove=null;selectionEpoch++;selected=null;moves=[];notify();
  }
  if(selected&&moves.some(([x,y])=>x===r&&y===c)){
   const from=[selected.r,selected.c],to=[r,c],moving=state.board[from[0]][from[1]],ownTurn=state.turn===moving.color;
   let promotion='Q';if(moving.type==='P'&&ChessBoard.promote(moving.color,r,c,state.board.length))promotion=await window.ChessUI.promotion();
   selected=null;moves=[];
   if(ownTurn)await sendMove(from,to,promotion);
   else{premove={from,to,promotion};notify();}
   return;
  }
  if(selected&&selected.r===r&&selected.c===c){selectionEpoch++;selected=null;moves=[];notify();return;}
  if(piece&&controlled(piece.color)&&state.active[piece.color]&&(piece.color===state.turn||(piece.color===room.role&&canQueue))){
   const code=room.code,revision=room.revision,epoch=++selectionEpoch;
   const result=await request('/api/rooms/'+code+'/legal','POST',{from:[r,c]});
   if(room&&room.code===code&&room.revision===revision&&epoch===selectionEpoch){selected={r,c};moves=result.moves;notify();}
  }else{selectionEpoch++;selected=null;moves=[];notify();}
 }
 async function drag(from,to){
  if(from[0]===to[0]&&from[1]===to[1])return choose(...from);
  if(!room||pending||room.state.status!=='playing'||room.role==='spectator')return;
  const state=room.state,moving=state.board[from[0]]?.[from[1]];
  if(!moving||!controlled(moving.color)||!state.active[moving.color])return;
  if(moving.color===state.turn){
   // Direct server-validated drag: one request instead of /legal followed by /move.
   selectionEpoch++;selected=null;moves=[];premove=null;notify();
   let promotion='Q';
   if(moving.type==='P'&&ChessBoard.promote(moving.color,...to,state.board.length))promotion=await window.ChessUI.promotion();
   return sendMove(from,to,promotion);
  }
  if(moving.color===room.role&&state.options.premoves){
   // Local replacement of a premove. Execution remains server-validated.
   selectionEpoch++;selected=null;moves=[];
   if(premove&&premove.from[0]===from[0]&&premove.from[1]===from[1]&&premove.to[0]===to[0]&&premove.to[1]===to[1]){
    premove=null;notify();return;
   }
   let promotion='Q';
   if(moving.type==='P'&&ChessBoard.promote(moving.color,...to,state.board.length))promotion=await window.ChessUI.promotion();
   premove={from,to,promotion};notify();
  }
 }
 async function action(name,extra={}){if(!room)return;pending=true;try{let res=await request('/api/rooms/'+room.code+'/'+name,'POST',extra);if(['reset','settings','undo'].includes(name))premove=null;accept(res.room);}finally{pending=false;}}
 function cancelInteraction(){selectionEpoch++;selected=null;moves=[];premove=null;notify();}
 function cancelPremove(){cancelInteraction();}
 return {onChange,create,join,openRoom,bootstrap,poll,choose,drag,action,get:()=>({room,token,selected,moves,premove,pending}),readStore,cancelPremove,cancelInteraction,controlled,currentActor};
})();
