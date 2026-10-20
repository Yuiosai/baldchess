// BaldChess UI: English and Russian, responsive boards, draggable vector pieces.
(()=>{
 const $=id=>document.getElementById(id);
 // Transitional DOM safety: an older cached page or script should not break room creation.
 const setHidden=(id,value)=>{const node=$(id);if(node)node.hidden=Boolean(value);};
 const LANG={
 en:{pickMode:'Choose your battlefield',duel:'1 VS 1',four:'4 PLAYERS',duelDesc:'Classic 8 × 8 board · 2 players',fourDesc:'Cross-shaped 14 × 14 board',language:'Language',tagline:'MULTIPLAYER CHESS',joinCode:'Join with room code',newLobby:'+ New lobby',createOrJoin:'Create a lobby or join using a code',turnNow:'TO MOVE',players:'Players',lobby:'Lobby',invite:'Share this code with your friends.',copyLink:'Copy invite link',editLobby:'⚙ Edit lobby settings',piecesDesign:'Piece designs',mySkin:'My pieces (visible to everyone)',myColor:'My piece color',uniform:'Show all pieces in one style (only for me)',history:'Move history',resign:'Resign',rematch:'↻ Rematch',noAccounts:'No accounts or registration. Your seat is saved in this browser. If someone disconnects, the host can play for them.',joinRoom:'Join a lobby',enterCode:'Enter the 6-character room code and your nickname.',code:'Room code',nickname:'Nickname',join:'Join',setup:'Starting position',classic:'Classic',fischer:'Fischer random',custom:'Custom board',format:'Game format',teams:'Teams',minutes:'Time per player',unlimited:'Unlimited',increment:'Time increment',noIncrement:'None',allowPremoves:'Allow premoves',differentClocks:'Different time for each player',teamsHelp:'Allies cannot capture each other. Last surviving team wins.',boardEditor:'Board editor',oneKing:'Exactly one king per color',color:'Color',piece:'Piece',restore:'Restore default',clear:'Clear',createLobby:'Create lobby',promotion:'Pawn promotion',choosePiece:'Choose a piece:',queen:'♛ Queen',rook:'♜ Rook',bishop:'♝ Bishop',knight:'♞ Knight',cancel:'Cancel',red:'Red',blue:'Blue',yellow:'Yellow',green:'Green',king:'King',pawn:'Pawn',erase:'Eraser',save:'Save settings',settings:'Room settings',waiting:'Waiting for players',ready:'Your turn',opponent:'Waiting for opponent',check:'Check! Protect your king',premoveAllowed:'You can make a premove',premoveSaved:'Premove queued. It will execute when your turn begins, if still legal.',finished:'Game over',win:'Winner',draw:'Draw',notConnected:'Not connected',disconnected:'Offline',connected:'Online',eliminated:'Eliminated',you:'You',controlling:'Host controlling',takeover:'Take control',release:'Release control',takeoverHint:'Host takeover available after 12 seconds offline.',room:'Room',inviteOthers:'Invite the remaining players',copy:'Copied!',moves:'Moves',entries:'entries',noMoves:'Moves will appear here',start:'All players joined. Game started!',castle:'castling',capture:'capture',checkmate:'checkmate',stalemate:'stalemate',timeout:'time ran out',resigned:'resigned',premovesOn:'premoves on',premovesOff:'no premoves',noClock:'no clock',individual:'individual clocks',classicSetup:'Classic',fischerSetup:'Fischer',customSetup:'Custom',ffa:'Free-for-All',teamsMode:'Teams',lobbyPhase:'Lobby',playingPhase:'Playing',endPhase:'Finished',confirmRematch:'Restart this game with the same settings?',confirmResign:'Resign this game?',enterValidCode:'Enter a valid 6-character code.',needTeams:'Choose at least two teams.',needKings:'Exactly one king required for:',selectSkin:'Choose a style',noControl:'You cannot control this color.',error:'Error',spectator:'Spectator',minute:'min',waitSlots:'Waiting',dragon:'Dragon Realm',fortress:'Iron Citadel',cosmos:'Cosmic',mystic:'Arcane',pixel:'Pixel Heroes',skinClassic:'Classic',copyPrompt:'Copy this link:',host:'Host',oneVsOne:'1 VS 1',fourPlayers:'4 PLAYERS',noMovesHint:'Click or drag a piece to move.',stay:'A returning player regains their pieces automatically.'},
 ru:{pickMode:'Выбери режим игры',duel:'1 НА 1',four:'4 ИГРОКА',duelDesc:'Обычная доска 8 × 8 · 2 игрока',fourDesc:'Крестообразная доска 14 × 14',language:'Язык',tagline:'СЕТЕВЫЕ ШАХМАТЫ',joinCode:'Войти по коду комнаты',newLobby:'+ Новое лобби',createOrJoin:'Создай комнату или войди по коду',turnNow:'СЕЙЧАС ХОДЯТ',players:'Игроки',lobby:'Лобби',invite:'Отправь код друзьям.',copyLink:'Скопировать ссылку',editLobby:'⚙ Настройки лобби',piecesDesign:'Стили фигур',mySkin:'Мои фигуры (видны всем)',myColor:'Цвет моих фигур',uniform:'Показывать все фигуры в одном стиле (только у меня)',history:'История ходов',resign:'Сдаться',rematch:'↻ Новая партия',noAccounts:'Без аккаунтов и регистрации. Место сохраняется в этом браузере. За отключившихся игроков может играть хост.',joinRoom:'Войти в лобби',enterCode:'Введи шестизначный код комнаты и своё имя.',code:'Код комнаты',nickname:'Имя игрока',join:'Войти',setup:'Расстановка',classic:'Классическая',fischer:'Фишер (случайная)',custom:'Своя расстановка',format:'Формат',teams:'Команды',minutes:'Время на игрока',unlimited:'Без ограничений',increment:'Прибавка за ход',noIncrement:'Без прибавки',allowPremoves:'Разрешить премувы',differentClocks:'Разное время для игроков',teamsHelp:'Союзники не бьют друг друга. Побеждает последняя оставшаяся команда.',boardEditor:'Редактор расстановки',oneKing:'Ровно один король каждого цвета',color:'Цвет',piece:'Фигура',restore:'Стандартная',clear:'Очистить',createLobby:'Создать лобби',promotion:'Превращение пешки',choosePiece:'Выбери фигуру:',queen:'♛ Ферзь',rook:'♜ Ладья',bishop:'♝ Слон',knight:'♞ Конь',cancel:'Отмена',red:'Красные',blue:'Синие',yellow:'Жёлтые',green:'Зелёные',king:'Король',pawn:'Пешка',erase:'Ластик',save:'Сохранить настройки',settings:'Настройки комнаты',waiting:'Ожидание игроков',ready:'Твой ход',opponent:'Ожидание соперника',check:'Шах! Защити короля',premoveAllowed:'Можно поставить премув',premoveSaved:'Премув записан. Он выполнится в твой ход, если останется допустимым.',finished:'Партия завершена',win:'Победа',draw:'Ничья',notConnected:'Не подключён',disconnected:'Не в сети',connected:'В игре',eliminated:'Выбыл',you:'Ты',controlling:'Управляет хост',takeover:'Взять управление',release:'Вернуть управление',takeoverHint:'Хост может взять чужой цвет после 12 секунд отсутствия игрока.',room:'Комната',inviteOthers:'Пригласи остальных',copy:'Скопировано!',moves:'Ходов',entries:'записей',noMoves:'Здесь появятся ходы',start:'Все игроки подключились. Партия началась!',castle:'рокировка',capture:'взятие',checkmate:'мат',stalemate:'пат',timeout:'время вышло',resigned:'сдался',premovesOn:'премувы включены',premovesOff:'без премувов',noClock:'без часов',individual:'индивидуальные часы',classicSetup:'Классика',fischerSetup:'Фишер',customSetup:'Своя доска',ffa:'Free-for-All',teamsMode:'Команды',lobbyPhase:'Лобби',playingPhase:'Игра',endPhase:'Завершена',confirmRematch:'Начать новую партию с теми же настройками?',confirmResign:'Сдаться и выбыть из партии?',enterValidCode:'Введите правильный шестизначный код.',needTeams:'Нужно минимум две разные команды.',needKings:'Нужен ровно один король цвета:',selectSkin:'Выбери стиль',noControl:'Нельзя управлять этим цветом.',error:'Ошибка',spectator:'Зритель',minute:'мин',waitSlots:'Ожидание',dragon:'Драконье королевство',fortress:'Железная крепость',cosmos:'Космос',mystic:'Магия',pixel:'Пиксельные герои',skinClassic:'Классика',copyPrompt:'Скопируй ссылку:',host:'Хост',oneVsOne:'1 НА 1',fourPlayers:'4 ИГРОКА',noMovesHint:'Выбери или перетащи фигуру.',stay:'Вернувшийся игрок автоматически получит свой цвет обратно.'}
 };
 Object.assign(LANG.en,{welcomeMotto:'YOUR BOARD. YOUR RULES.',online:'ONLINE',backToGame:'Back to current game',copyCode:'Copy room code',team:'Team',joinHint:'Use this room code to connect.',invalidSkin:'Invalid skin',player:'Player',second:'sec',teamsHeader:'TEAMS · 4 PLAYERS',freeForAllHeader:'FREE FOR ALL · 4 PLAYERS',footer:'ONLINE · CHESS',sendInvite:'Invite link copied',seatTop:'Top',seatBottom:'Bottom',seatLeft:'Left',seatRight:'Right'});
 Object.assign(LANG.ru,{welcomeMotto:'ТВОЯ ДОСКА. ТВОИ ПРАВИЛА.',online:'В СЕТИ',backToGame:'Вернуться к текущей партии',copyCode:'Скопировать код комнаты',team:'Команда',joinHint:'Используй этот код для входа.',invalidSkin:'Неверный скин',player:'Игрок',second:'сек',teamsHeader:'КОМАНДЫ · 4 ИГРОКА',freeForAllHeader:'FREE FOR ALL · 4 ИГРОКА',footer:'СЕТЕВЫЕ ШАХМАТЫ',sendInvite:'Ссылка-приглашение скопирована',seatTop:'Верх',seatBottom:'Низ',seatLeft:'Слева',seatRight:'Справа'});
 Object.assign(LANG.en,{playSounds:'Move sounds'});
 Object.assign(LANG.ru,{playSounds:'Звуки ходов'});
 Object.assign(LANG.en,{customize:'Customize Board',displayOptions:'Display',showPlayerSkins:'Show other players’ skins',showPlayerHelp:'Switch off to see the entire board and every piece in your own style. Other players will not be affected.',palettes:'Color Palettes',artSkins:'Art Skins',appearanceExplain:'Both choices change board colors and the pieces together. With player skins enabled, friends see your territory and your figures in this style.',livePreview:'Preview',applyAppearance:'Apply appearance'});
 Object.assign(LANG.ru,{customize:'Кастомизация доски',displayOptions:'Отображение',showPlayerSkins:'Показывать скины других игроков',showPlayerHelp:'Выключи, чтобы вся доска и все фигуры отображались в твоём оформлении. У других игроков ничего не изменится.',palettes:'Цветовые палитры',artSkins:'Художественные скины',appearanceExplain:'И палитры, и скины меняют вместе доску, цвета и фигуры. При включённом отображении другие игроки увидят твою область доски и твои фигуры.',livePreview:'Предпросмотр',applyAppearance:'Применить оформление'});
 let language='en',chosenMode='four',showWelcome=true,editing=false,showPlayerThemes=true,chosenAppearance='palette:classic',cells=[],editorCells=[],boardSize=0,editorSize=0,toastTimer,editor={board:ChessBoard.startBoard()};
 const load=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
 const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
 const rememberedNickname=()=>load('baldchess_nickname','').trim();
 const saveNickname=name=>{if(name)save('baldchess_nickname',name.trim().slice(0,24));};
 const t=key=>LANG[language][key]??LANG.en[key]??key;
 const players=mode=>ChessBoard.seats(mode);
 const colorLabel=c=>t(c);
 function playerName(room,color){return room?.seats?.[color]||t('player');}
 const skinIds=['classic','dragons','fortress','cosmos','mystic','pixel'];
 const skinKey={classic:'skinClassic',dragons:'dragon',fortress:'fortress',cosmos:'cosmos',mystic:'mystic',pixel:'pixel'};
 function translate(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t(el.dataset.t);});
  $('language-select').value=language;$('language-in-game').value=language;
  $('copy-room').title=t('copyCode');
  $('join-name').placeholder=t('player');$('host-name').placeholder=t('player');
  for(const c of ChessBoard.COLORS){const team=$('team-'+c);if(team)for(let i=0;i<team.options.length;i++)team.options[i].textContent=t('team')+' '+('ABCD'[i]);const time=$('seat-time-'+c);if(time)for(const opt of time.options)opt.textContent=opt.value+' '+t('minute');}
  for(const opt of $('minutes-select').options)if(Number(opt.value)>0)opt.textContent=opt.value+' '+t('minute');
  for(const opt of $('increment-select').options)if(Number(opt.value)>0)opt.textContent='+'+opt.value+' '+t('second');
  
  for(const color of ChessBoard.COLORS){const opt=$('editor-color').querySelector(`option[value="${color}"]`);if(opt)opt.textContent=t(color);}
  for(const [id,key] of Object.entries({K:'king',Q:'queen',R:'rook',B:'bishop',N:'knight',P:'pawn',erase:'erase'})){const opt=$('editor-piece').querySelector(`option[value="${id}"]`);if(opt)opt.textContent=t(key).replace(/^.\s/, '');}
  for(const color of ChessBoard.COLORS){const label=$('team-label-'+color);if(label)label.textContent=t(color);const tl=$('time-label-'+color);if(tl)tl.textContent=t(color);}
  const {room,selected,moves,premove}=ChessGame.get();render(room,selected,moves,premove);if($('customize-dialog').open){updateAppearanceCards();previewAppearance();}
 }
 function setLanguage(next){language=next;save('baldchess_language',next);translate();}
 function toast(text){const el=$('toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);}
 window.ChessUI={t,toast,promotion:()=>new Promise(resolve=>{
  const d=$('promotion-dialog');let done=false;
  const finish=kind=>{if(done)return;done=true;d.removeEventListener('click',pick);d.removeEventListener('close',closed);if(d.open)d.close();resolve(kind);};
  const pick=e=>{const btn=e.target.closest('[data-promotion]');if(btn)finish(btn.dataset.promotion);};
  const closed=()=>finish('Q');d.addEventListener('click',pick);d.addEventListener('close',closed);d.showModal();
 })};

 // Shared, original wooden chess-click sound. Same for every palette and art skin.
 const ChessAudio=(()=>{
  let context=null,buffer=null;
  let enabled=load('baldchess_sound','true')!=='false';
  const AudioCtor=window.AudioContext||window.webkitAudioContext;
  function unlock(){
   if(!AudioCtor||!enabled)return null;
   if(!context)context=new AudioCtor();
   if(context.state==='suspended')context.resume().catch(()=>{});
   if(!buffer){
    buffer=context.createBuffer(1,Math.round(context.sampleRate*.17),context.sampleRate);
    const data=buffer.getChannelData(0);
    // Soft damped tap rather than digital beeps or themed sound effects.
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-27*i/data.length);
   }
   return context;
  }
  window.addEventListener('pointerdown',()=>{if(enabled)unlock();},{passive:true});
  window.addEventListener('keydown',()=>{if(enabled)unlock();});
  function tap(at,level=1,pitch=1){
   const ac=unlock();if(!ac)return;
   const hiss=ac.createBufferSource(),band=ac.createBiquadFilter(),amp=ac.createGain();
   hiss.buffer=buffer;
   band.type='lowpass';band.frequency.value=1180*pitch;band.Q.value=.4;
   amp.gain.setValueAtTime(.0001,at);
   amp.gain.linearRampToValueAtTime(.125*level,at+.003);
   amp.gain.exponentialRampToValueAtTime(.0001,at+.063);
   hiss.connect(band);band.connect(amp);amp.connect(ac.destination);
   hiss.start(at);hiss.stop(at+.075);
   const osc=ac.createOscillator(),body=ac.createGain();
   osc.type='sine';osc.frequency.setValueAtTime(225*pitch,at);
   osc.frequency.exponentialRampToValueAtTime(95*pitch,at+.06);
   body.gain.setValueAtTime(.0001,at);
   body.gain.linearRampToValueAtTime(.04*level,at+.002);
   body.gain.exponentialRampToValueAtTime(.0001,at+.075);
   osc.connect(body);body.connect(ac.destination);
   osc.start(at);osc.stop(at+.085);
  }
  function playMove(meta={}){
   if(!enabled)return;
   const ac=unlock();if(!ac)return;
   const t=ac.currentTime+.012;
   tap(t,meta.capture?1.12:1,meta.capture?.85:1);
   tap(t+.047,meta.capture?.74:.62,meta.capture?1.12:.94);
  }
  function setEnabled(value){enabled=Boolean(value);save('baldchess_sound',String(enabled));if(enabled)unlock();}
  return {playMove,setEnabled,isEnabled:()=>enabled};
 })();
 let lastMoveSoundSignature='';
 function maybePlayMoveSound(room){
  if(!room?.state){lastMoveSoundSignature='';return;}
  const s=room.state,move=s.last_move;
  if(!move||!s.move_count){lastMoveSoundSignature=room.code+'|idle';return;}
  const moveItem=[...s.history].reverse().find(item=>item&&typeof item==='object'&&item.kind==='move');
  const mover=moveItem?.color||null;
  const signature=[room.code,s.move_count,move.from?.join('-')||'',move.to?.join('-')||'',mover||''].join('|');
  if(!lastMoveSoundSignature||!lastMoveSoundSignature.startsWith(room.code+'|')){lastMoveSoundSignature=signature;return;}
  if(signature===lastMoveSoundSignature)return;
  lastMoveSoundSignature=signature;
  ChessAudio.playMove({capture:Boolean(moveItem?.capture),castle:Boolean(moveItem?.castle)});
 }
 let lastAnimatedMoveSignature='';
 function animateLastMove(room){
  if(!room||!room.state?.last_move){lastAnimatedMoveSignature=room?.code?room.code+'|idle':'';return;}
  const state=room.state,from=state.last_move.from,to=state.last_move.to;
  const signature=room.code+'|'+state.move_count+'|'+from.join(',')+'|'+to.join(',');
  if(!lastAnimatedMoveSignature||!lastAnimatedMoveSignature.startsWith(room.code+'|')){
   lastAnimatedMoveSignature=signature;return;
  }
  if(lastAnimatedMoveSignature===signature)return;
  lastAnimatedMoveSignature=signature;
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  const start=cells[from[0]]?.[from[1]],end=cells[to[0]]?.[to[1]];
  const piece=end?.querySelector('.piece');
  if(!start||!end||!piece||!piece.animate)return;
  const first=start.getBoundingClientRect(),last=end.getBoundingClientRect();
  const dx=first.left+first.width/2-last.left-last.width/2;
  const dy=first.top+first.height/2-last.top-last.height/2;
  const degrees={red:0,yellow:180,blue:90,green:-90}[room.role]||0;
  const rot=degrees?' rotate('+degrees+'deg)':'';
  // Animate the actual piece, keeping its silhouette upright in every view.
  piece.animate([{transform:`translate(${dx}px,${dy}px)${rot}`},{transform:`translate(0px,0px)${rot}`}],
   {duration:165,easing:'cubic-bezier(.2,.8,.25,1)'});
 }
 function pieceSpan(p,skin,color,dead=false){
  const el=document.createElement('span');el.className='piece'+(dead?' dead':'');el.style.color=color||'#fff';el.appendChild(ChessPieces.get(p.type,skin));return el;
 }
 function myAppearance(room){return room?.appearances?.[room.role]||load('baldchess_appearance','palette:classic');}
 function shownAppearance(room,color){return !showPlayerThemes?myAppearance(room):(room?.appearances?.[color]||'palette:classic');}
 function pieceAppearance(room,color){return shownAppearance(room,color);}
 function colorFor(p,room,appearance){const theme=ChessThemes.get(appearance||shownAppearance(room,p.color));const mode=room?.state?.options?.mode||chosenMode;const localUniform=room && !showPlayerThemes && mode==='four';const palette=localUniform&&(theme.uniformPiece||theme.piece)?(theme.uniformPiece||theme.piece):theme.piece;return palette[p.color];}
 function buildCells(target,size,sink,onChoose){
  sink.length=0;const fragment=document.createDocumentFragment();
  for(let r=0;r<size;r++){let row=[];for(let c=0;c<size;c++){
   const valid=ChessBoard.playable(r,c,size),el=document.createElement(valid?'button':'div');
   el.className=valid?'square '+((r+c)%2?'dark':'light'):'cutout';
   if(valid){el.type='button';el.dataset.r=r;el.dataset.c=c;el.addEventListener('click',()=>onChoose(r,c));}
   fragment.appendChild(el);row.push(el);
  }sink.push(row);}target.replaceChildren(fragment);
  target.style.gridTemplateColumns=`repeat(${size},minmax(0,1fr))`;
  target.style.gridTemplateRows=`repeat(${size},minmax(0,1fr))`;
 }
 function ensureBoard(mode){const size=mode==='duel'?8:14;if(boardSize!==size){boardSize=size;buildCells($('board'),size,cells,(r,c)=>{if(ignoreClick){ignoreClick=false;return;}ChessGame.choose(r,c).catch(e=>toast(serverError(e.message)));});}}
 function ensureEditor(){const size=chosenMode==='duel'?8:14;if(editorSize!==size){editorSize=size;buildCells($('editor-board'),size,editorCells,(r,c)=>{const kind=$('editor-piece').value;editor.board[r][c]=kind==='erase'?null:{color:$('editor-color').value,type:kind};renderEditor();});}}
 function renderEditor(){ensureEditor();for(let r=0;r<editorSize;r++)for(let c=0;c<editorSize;c++){
  const cell=editorCells[r][c];if(!ChessBoard.playable(r,c,editorSize))continue;cell.replaceChildren();const p=editor.board[r]?.[c];if(p)cell.appendChild(pieceSpan(p,'classic',colorFor(p)));
 }}
 function renderBoard(room,selected,moves,premove){
  const orientation=room?.role&&room.role!=='spectator'?room.role:'red';
  $('board').className='board orientation-'+orientation;
  const state=room?.state,mode=state?.options.mode||chosenMode;
  ensureBoard(mode);const size=boardSize,board=state?.board||ChessBoard.startBoard(mode),hits=new Set(moves.map(p=>p.join(',')));
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){
   if(!ChessBoard.playable(r,c,size))continue;
   const el=cells[r][c],p=board[r]?.[c],zone=ChessThemes.owner(r,c,size);
   const tileTheme=ChessThemes.get(shownAppearance(room,zone));
   el.className='square '+((r+c)%2?'dark':'light')+(tileTheme.art?' theme-art':'');
   el.dataset.art=tileTheme.art||'';
   el.style.setProperty('--tile-light',tileTheme.light);el.style.setProperty('--tile-dark',tileTheme.dark);
   el.replaceChildren();
   if(state?.last_move&&[state.last_move.from,state.last_move.to].some(pos=>pos[0]===r&&pos[1]===c))el.classList.add('last-move');
   if(selected?.r===r&&selected?.c===c)el.classList.add('selected');
   if(hits.has(`${r},${c}`)){const source=selected&&board[selected.r][selected.c];el.classList.add(p?'can-take':'can-move');if(p?.type==='R'&&source?.type==='K'&&source.color===p.color)el.classList.add('can-castle');}
   if(premove&&premove.to[0]===r&&premove.to[1]===c)el.classList.add('queued');
   if(p){const appearance=pieceAppearance(room,p.color),skin=ChessThemes.get(appearance).skin;el.appendChild(pieceSpan(p,skin,colorFor(p,room,appearance),state&&!state.active[p.color]));if(state&&p.type==='K'&&state.active[p.color]&&state.checks[p.color])el.classList.add('king-check');el.setAttribute('aria-label',`${ChessBoard.squareName(r,c,size)}: ${colorLabel(p.color)}, ${p.type}`);}
   else el.setAttribute('aria-label',ChessBoard.squareName(r,c,size));
   if(r===size-1||!ChessBoard.playable(r+1,c,size)){const label=document.createElement('span');label.className='coord file';label.textContent='abcdefghijklmn'[c];el.appendChild(label);}
   if(c===0||!ChessBoard.playable(r,c-1,size)){const label=document.createElement('span');label.className='coord rank';label.textContent=size-r;el.appendChild(label);}
  }
 }
 function clockText(seconds){const n=Math.max(0,Math.ceil(seconds));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
 function updateClock(){const {room}=ChessGame.get();if(!room?.state.clock)return;const s=room.state;for(const c of players(s.options.mode)){
  const el=$('clock-'+c);if(!el)continue;let n=s.clock[c];if(s.turn===c&&s.status==='playing')n-=Math.max(0,(Date.now()-room.seenAt)/1000);el.textContent=clockText(n);el.classList.toggle('low-clock',n<=20&&s.active[c]);
 }}
 function historyText(item,room){
  if(typeof item==='string'){
   const match=item.match(/^(Красные|Синие|Жёлтые|Зелёные): ([a-n]\d+) → ([a-n]\d+)(.*)$/);
   if(match){const c={Красные:'red',Синие:'blue',Жёлтые:'yellow',Зелёные:'green'}[match[1]];return playerName(room,c)+': '+match[2]+' → '+match[3]+match[4].replace('рокировка',t('castle'));}return item;
  }
  if(item.kind==='move')return `${playerName(room,item.color)}: ${item.from} → ${item.to}${item.castle?' · '+t('castle'):item.capture?' ×':''}${item.promotion?' ='+item.promotion:''}`;
  if(item.kind==='start')return t('start');
  if(item.kind==='win')return item.players.length?t('win')+': '+item.players.map(c=>playerName(room,c)).join(', '):t('draw');
  if(item.kind==='draw')return t('draw');
  if(item.kind==='out')return playerName(room,item.color)+': '+t(item.reason);
  return '';
 }
 const messages={
  'Server connection lost':['Server connection lost.','Нет соединения с сервером.'],
  'Invalid server response':['Invalid server response.','Неверный ответ сервера.'],
  'Server error':['Server error.','Ошибка сервера.'],
  'Настройки должны быть объектом':['Invalid settings.','Неверные настройки.'],
  'Неверное число игроков':['Invalid player count.','Неверное число игроков.'],
  'Неизвестный вариант расстановки':['Unknown starting position.','Неизвестная расстановка.'],
  'Неверный режим команд':['Unknown team mode.','Неверный режим команд.'],
  'Неверная схема команд':['Invalid team assignments.','Неверная схема команд.'],
  'Нужно хотя бы две разные команды':['Choose at least two distinct teams.','Нужно хотя бы две команды.'],
  'Недопустимое время на игрока':['Invalid time control.','Недопустимое время.'],
  'Недопустимая прибавка времени':['Invalid time increment.','Недопустимая прибавка.'],
  'Недопустимые индивидуальные таймеры':['Invalid individual time controls.','Недопустимые индивидуальные таймеры.'],
  'Неверная настройка премувов':['Invalid premove settings.','Неверная настройка премувов.'],
  'Фигуры не могут стоять за пределами поля':['Pieces cannot be placed outside the board.','Фигуры не могут стоять за пределами поля.'],
  'Неизвестная фигура в редакторе':['Unknown piece in board editor.','Неизвестная фигура в редакторе.'],
  'Для каждого цвета нужен ровно один король':['Each player must have exactly one king.','Для каждого цвета нужен ровно один король.'],
  'Партия ещё не началась или уже окончена':['The game is not active.','Партия ещё не началась или уже закончилась.'],
  'Неверные координаты':['Invalid board coordinates.','Неверные координаты.'],
  'Invalid coordinates':['Invalid board coordinates.','Неверные координаты.'],
  'Клетка за пределами доски':['Square is outside the board.','Клетка за пределами доски.'],
  'Сейчас ходят фигуры другого цвета':['It is not your turn.','Сейчас не твой ход.'],
  'It is not your turn':['It is not your turn.','Сейчас не твой ход.'],
  'Недопустимый ход или король под шахом':['Illegal move or king in check.','Недопустимый ход или король под шахом.'],
  'Допустимы только ферзь, ладья, слон и конь':['Promote to queen, rook, bishop or knight.','Выбери ферзя, ладью, слона или коня.'],
  'Этот игрок уже выбыл или партия закончилась':['This player is out or the game has ended.','Этот игрок выбыл или партия завершена.'],
  'Комната не найдена':['Room not found.','Комната не найдена.'],
  'Партия уже началась':['This game has already started.','Партия уже началась.'],
  'Комната заполнена':['The lobby is full.','Комната заполнена.'],
  'Вы не участвуете в этой партии':['You do not have a player seat in this room.','Ты не участвуешь в этой партии.'],
  'Only the host can control a disconnected player':['Only the host can take over disconnected players.','Только хост может играть за отключившихся игроков.'],
  'Invalid player slot':['Invalid player seat.','Неверное место игрока.'],
  'The player is still connected':['This player is still online.','Игрок всё ещё в сети.'],
  'Перезапустить партию может только создатель':['Only the host can restart a game.','Только хост может перезапустить партию.'],
  'Настройки меняет создатель до начала партии':['Only the host can change settings before the game.','Настройки меняет хост до начала партии.'],
  'Неизвестный скин фигур':['Unknown piece skin.','Неизвестный скин фигур.'],
  'Неверный цвет фигур':['Invalid piece color.','Неверный цвет фигур.']
 };
 function serverError(value){
  if(value.startsWith('Поле редактора должно быть '))return language==='ru'?value:'Board editor must be '+value.split(' ').at(-1)+'.';
  const translated=messages[value];return translated?translated[language==='ru'?1:0]:(language==='ru'?t('error')+': ':t('error')+': ')+value;
 }

 function render(room,selected,moves,premove){
  maybePlayMoveSound(room);
  renderBoard(room,selected,moves,premove);
  animateLastMove(room);
  const has=Boolean(room);setHidden('welcome',!showWelcome);setHidden('game-page',showWelcome||!has);setHidden('back-to-game',!has);setHidden('loading',has);
  setHidden('invite-panel',!has);setHidden('appearance-card',!has);
  $('resign-button').disabled=!has||room.state.status!=='playing'||room.role==='spectator'||!room.state.active[room.role];
  $('reset-button').disabled=!has||room.role!=='red';
  if(!has)return;
  chosenMode=room.state.options.mode;
  const s=room.state,opts=s.options,waiting=s.status==='waiting',done=s.status==='finished',list=players(opts.mode),myTurn=ChessGame.controlled(s.turn);
  // Keep the move history visible in the lobby and during play.
  setHidden('history-card',false);
  $('invite-panel').classList.toggle('compact-lobby',!waiting);
  if($('show-player-themes')?.closest('label'))$('show-player-themes').closest('label').title=t('showPlayerHelp');
  $('game-mode').textContent=opts.mode==='duel'?t('oneVsOne'):opts.format==='teams'?t('teamsHeader'):t('freeForAllHeader');
  $('game-title').textContent=opts.variant==='fischer'?t('fischer'):opts.variant==='custom'?t('custom'):'BALDCHESS';
  $('mode-label').textContent=t('room')+' '+room.code;
  $('turn-name').textContent=done?(s.winners.length?t('win')+': '+s.winners.map(c=>playerName(room,c)).join(', '):t('draw')):waiting?t('waiting'):playerName(room,s.turn);
  $('turn-detail').textContent=done?t('finished'):waiting?room.joined+' / '+list.length:(myTurn?(s.checks[s.turn]?t('check'):t('ready')):t('opponent'));
  $('turn-phase').textContent=done?t('endPhase'):waiting?t('lobbyPhase'):t('playingPhase');
  $('status-message').textContent=waiting?t('inviteOthers'):done?t('finished'):s.checks[s.turn]?t('check'):t('turnNow')+': '+playerName(room,s.turn);
  $('move-counter').textContent=t('moves')+': '+s.move_count;
  $('player-count').textContent=room.joined+' / '+list.length;
  $('room-code').textContent=room.code;
  setHidden('edit-settings',!(room.role==='red'&&waiting));
  $('customize-button').disabled=room.role==='spectator';
  $('room-options-summary').textContent=[t({classic:'classicSetup',fischer:'fischerSetup',custom:'customSetup'}[opts.variant]),opts.mode==='duel'?t('oneVsOne'):opts.format==='teams'?t('teamsMode'):t('ffa'),opts.seat_minutes?t('individual'):opts.minutes?opts.minutes+' '+t('minute'):t('noClock'),opts.premoves?t('premovesOn'):t('premovesOff')].join(' · ');
  $('invite-hint').textContent=waiting?t('inviteOthers'):t('stay');
  const nodes=$('players');nodes.replaceChildren();for(const c of list){
   const div=document.createElement('div');div.className='player-row';if(s.turn===c)div.classList.add('playing');if(!s.active[c])div.classList.add('eliminated');
   const info=document.createElement('div');info.className='player-info';
   const name=document.createElement('strong');name.textContent=playerName(room,c);
   const sub=document.createElement('small');const active=!s.active[c]?t('eliminated'):!room.seats[c]?t('notConnected'):room.offline[c]?t('disconnected'):t('connected');
   const team=opts.format==='teams'?` · ${t('team')} ${'ABCD'[opts.teams[c]]}`:'';
   sub.textContent=(room.role===c?t('you')+' · ':'')+active+team+(room.host_controls.includes(c)?' · '+t('controlling'):'');
   info.append(name,sub);div.append(info);
   if(s.clock){const clock=document.createElement('span');clock.className='clock';clock.id='clock-'+c;div.append(clock);}
   if(room.role==='red'&&c!=='red'&&room.seats[c]&&room.offline[c]){
    const button=document.createElement('button');button.className='button outline takeover';button.textContent=room.host_controls.includes(c)?t('release'):t('takeover');button.title=t('takeoverHint');
    button.addEventListener('click',()=>ChessGame.action('takeover',{target:c}).catch(e=>toast(serverError(e.message))));div.append(button);
   }
   nodes.append(div);
  }
  const hist=$('history');hist.replaceChildren();for(const item of s.history.slice(-100).reverse()){
   const li=document.createElement('li');li.textContent=historyText(item,room);hist.append(li);
  }if(!s.history.length){const li=document.createElement('li');li.className='muted-item';li.textContent=t('noMoves');hist.append(li);}
  $('history-count').textContent=s.history.length+' '+(language==='en'?(s.history.length===1?'entry':'entries'):(s.history.length%10===1&&s.history.length%100!==11?'запись':([2,3,4].includes(s.history.length%10)&&!([12,13,14].includes(s.history.length%100))?'записи':'записей')));updateClock();
 }
 ChessGame.onChange(render);
 // Room settings, unchanged for all players except teams in 1v1.
 for(const c of ChessBoard.COLORS){
  const team=document.createElement('label');team.className='field';const span=document.createElement('span');span.id='team-label-'+c;team.append(span);
  const sel=document.createElement('select');sel.id='team-'+c;for(let i=0;i<4;i++){const o=document.createElement('option');o.value=i;o.textContent='Team '+('ABCD'[i]);sel.append(o);}sel.value=ChessBoard.COLORS.indexOf(c);team.append(sel);$('team-controls').append(team);
  const label=document.createElement('label');label.className='field';const name=document.createElement('span');name.id='time-label-'+c;label.append(name);
  const time=document.createElement('select');time.id='seat-time-'+c;for(const min of [1,3,5,10,15,30,60]){const o=document.createElement('option');o.value=min;o.textContent=min+' min';time.append(o);}time.value='10';label.append(time);$('seat-clock-settings').append(label);
 }
 for(const c of ChessBoard.COLORS){let opt=document.createElement('option');opt.value=c;$('editor-color').append(opt);}
 for(const kind of ['K','Q','R','B','N','P','erase']){let opt=document.createElement('option');opt.value=kind;$('editor-piece').append(opt);}
 function setModeUI(){
  const duel=chosenMode==='duel';setHidden('format-field',duel);setHidden('team-settings',duel||$('format-select').value!=='teams');
  for(const c of ChessBoard.COLORS){const clock=$('time-label-'+c)?.parentElement,team=$('team-label-'+c)?.parentElement;if(clock)clock.hidden=duel&&!['red','yellow'].includes(c);if(team)team.hidden=duel;}
  for(const c of ChessBoard.COLORS) $('editor-color').querySelector(`option[value="${c}"]`).hidden=duel&&!['red','yellow'].includes(c);
  if(duel&&!['red','yellow'].includes($('editor-color').value))$('editor-color').value='red';
  setHidden('custom-settings',$('setup-select').value!=='custom');
  renderEditor();
 }
 function fillOptions(opts){
  $('setup-select').value=opts.variant;$('format-select').value=opts.format;$('minutes-select').value=opts.minutes;$('increment-select').value=opts.increment;
  $('allow-premoves').checked=opts.premoves;$('separate-clocks').checked=Boolean(opts.seat_minutes);setHidden('seat-clock-settings',!opts.seat_minutes);
  for(const c of ChessBoard.COLORS){$('team-'+c).value=opts.teams[c];$('seat-time-'+c).value=opts.seat_minutes?.[c]||opts.minutes||10;}
  editor.board=opts.custom_board?JSON.parse(JSON.stringify(opts.custom_board)):ChessBoard.startBoard(chosenMode);
  setModeUI();
 }
 function getOptions(){
  return {mode:chosenMode,variant:$('setup-select').value,format:chosenMode==='duel'?'ffa':$('format-select').value,
   teams:Object.fromEntries(ChessBoard.COLORS.map(c=>[c,Number($('team-'+c).value)])),minutes:Number($('minutes-select').value),increment:Number($('increment-select').value),
   seat_minutes:$('separate-clocks').checked?Object.fromEntries(players(chosenMode).map(c=>[c,Number($('seat-time-'+c).value)])):null,
   premoves:$('allow-premoves').checked,custom_board:$('setup-select').value==='custom'?editor.board:null};
 }
 function openSettings(edit=false){
  editing=edit;const room=ChessGame.get().room;if(edit&&room)chosenMode=room.state.options.mode;
  $('settings-title').textContent=edit?t('settings'):t('createLobby');$('save-settings').textContent=edit?t('save'):t('createLobby');
  setHidden('host-name-field',edit);$('settings-error').textContent='';
  if(!edit)$('host-name').value=rememberedNickname()||'Player 1';
  if(edit&&room)fillOptions(room.state.options);else fillOptions({variant:'classic',format:'ffa',minutes:10,increment:0,premoves:true,teams:{red:0,blue:1,yellow:2,green:3},seat_minutes:null});
  $('settings-dialog').showModal();
 }
 $('choose-duel').addEventListener('click',()=>{chosenMode='duel';openSettings();});
 $('choose-four').addEventListener('click',()=>{chosenMode='four';openSettings();});
 $('create-button').addEventListener('click',()=>{showWelcome=true;const g=ChessGame.get();render(g.room,g.selected,g.moves,g.premove);});
 $('back-to-game').addEventListener('click',()=>{showWelcome=false;const g=ChessGame.get();render(g.room,g.selected,g.moves,g.premove);});
 $('edit-settings').addEventListener('click',()=>openSettings(true));
 $('close-settings').addEventListener('click',()=>$('settings-dialog').close());
 $('setup-select').addEventListener('change',setModeUI);
 $('format-select').addEventListener('change',setModeUI);
 $('separate-clocks').addEventListener('change',()=>{setHidden('seat-clock-settings',!$('separate-clocks').checked);});
 document.querySelectorAll('.team-preset').forEach(el=>el.addEventListener('click',()=>{const preset={two:[0,1,0,1],three:[0,0,0,1],split:[0,1,0,2]}[el.dataset.preset];ChessBoard.COLORS.forEach((c,i)=>{$('team-'+c).value=preset[i];});}));
 $('editor-clear').addEventListener('click',()=>{editor.board=Array.from({length:editorSize},()=>Array(editorSize).fill(null));renderEditor();});
 $('editor-standard').addEventListener('click',()=>{editor.board=ChessBoard.startBoard(chosenMode);renderEditor();});
 $('settings-form').addEventListener('submit',async e=>{
  e.preventDefault();const opts=getOptions();$('settings-error').textContent='';
  if(opts.format==='teams'&&new Set(Object.values(opts.teams)).size<2){$('settings-error').textContent=t('needTeams');return;}
  if(opts.variant==='custom')for(const c of players(chosenMode)){const count=editor.board.flat().filter(p=>p?.color===c&&p.type==='K').length;if(count!==1){$('settings-error').textContent=t('needKings')+' '+colorLabel(c);return;}}
  $('save-settings').disabled=true;
  try{if(editing)await ChessGame.action('settings',{options:opts});else{
    await ChessGame.create(opts,$('host-name').value.trim()||'Player 1');
    saveNickname(ChessGame.get().room?.seats?.red);
    const preferred=load('baldchess_appearance','palette:classic');
    if(ChessThemes.themes[preferred]&&preferred!=='palette:classic')await ChessGame.action('appearance',{appearance:preferred});
   }
   $('settings-dialog').close();showWelcome=false;const g=ChessGame.get();render(g.room,g.selected,g.moves,g.premove);
  }catch(err){$('settings-error').textContent=serverError(err.message);}finally{$('save-settings').disabled=false;}
 });
 function openJoin(){$('join-error').textContent='';$('join-name').value=rememberedNickname();$('join-dialog').showModal();}
 $('welcome-join').addEventListener('click',openJoin);$('join-button').addEventListener('click',openJoin);
 $('close-join').addEventListener('click',()=>$('join-dialog').close());
 $('join-form').addEventListener('submit',async e=>{
  e.preventDefault();const code=$('join-code').value.trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code)){$('join-error').textContent=t('enterValidCode');return;}
  try{await ChessGame.join(code,$('join-name').value.trim()||'Player');
    const joinedRoom=ChessGame.get().room;saveNickname(joinedRoom?.seats?.[joinedRoom.role]);
    const preferred=load('baldchess_appearance','palette:classic');
    if(ChessThemes.themes[preferred]&&preferred!=='palette:classic')await ChessGame.action('appearance',{appearance:preferred});
    $('join-dialog').close();showWelcome=false;const g=ChessGame.get();render(g.room,g.selected,g.moves,g.premove);}
  catch(err){$('join-error').textContent=serverError(err.message);}
 });
 async function copy(str){try{await navigator.clipboard.writeText(str);toast(t('copy'));}catch{window.prompt(t('copyPrompt'),str);}}
 $('copy-room').addEventListener('click',()=>copy(ChessGame.get().room.code));
 $('copy-link').addEventListener('click',()=>copy(location.origin+location.pathname+'?room='+ChessGame.get().room.code));
 $('resign-button').addEventListener('click',()=>{if(confirm(t('confirmResign')))ChessGame.action('resign').catch(err=>toast(serverError(err.message)));});
 $('reset-button').addEventListener('click',()=>{if(confirm(t('confirmRematch')))ChessGame.action('reset').catch(err=>toast(serverError(err.message)));});

 // One local switch: show the board portions and custom pieces chosen by other players.
 $('sound-enabled')?.addEventListener('change',e=>ChessAudio.setEnabled(e.target.checked));
 $('show-player-themes').addEventListener('change',()=>{
  showPlayerThemes=$('show-player-themes').checked;save('baldchess_show_player_themes',String(showPlayerThemes));
  const g=ChessGame.get();renderBoard(g.room,g.selected,g.moves,g.premove);
 });
 const appearanceDialog=$('customize-dialog');let appearanceCategory='palette';
 const appearanceGrid=$('appearance-grid');
 function previewAppearance(){
  const style=ChessThemes.get(chosenAppearance);$('preview-label').textContent=style[language];
  const mini=$('appearance-mini');mini.replaceChildren();
  const kinds=['R','N','B','Q','K','B','N','R'];
  for(let r=0;r<4;r++)for(let c=0;c<8;c++){
   const cell=document.createElement('div');cell.className='mini-square '+((r+c)%2?'dark':'light');
   cell.style.backgroundColor=(r+c)%2?style.dark:style.light;
   if(r===0||r===3){const color=r===0?'yellow':'red';const kind=r===0?kinds[c]:c%2?'P':kinds[c];
    cell.append(pieceSpan({type:kind,color},style.skin,style.piece[color]));}
   mini.append(cell);
  }
 }
 function updateAppearanceCards(){
  $('palette-tab').classList.toggle('active',appearanceCategory==='palette');
  $('skins-tab').classList.toggle('active',appearanceCategory==='skin');
  appearanceGrid.replaceChildren();
  for(const id of appearanceCategory==='palette'?ChessThemes.palettes:ChessThemes.skins){
   const style=ChessThemes.get(id),card=document.createElement('button');card.type='button';
   card.className='appearance-option'+(id===chosenAppearance?' selected-look':'');
   card.setAttribute('aria-pressed',String(chosenAppearance===id));
   const tiles=document.createElement('div');tiles.className='appearance-swatches';
   for(let n=0;n<4;n++){const b=document.createElement('span');b.style.background=(n%2?style.dark:style.light);tiles.append(b);}
   const icon=pieceSpan({type:'N',color:'red'},style.skin,style.piece.red);tiles.append(icon);
   const title=document.createElement('strong');title.textContent=style[language];
   card.append(tiles,title);card.addEventListener('click',()=>{chosenAppearance=id;updateAppearanceCards();previewAppearance();});
   appearanceGrid.append(card);
  }
 }
 function openCustomize(){
  const room=ChessGame.get().room;chosenAppearance=myAppearance(room);
  appearanceCategory=chosenAppearance.startsWith('skin:')?'skin':'palette';
  updateAppearanceCards();previewAppearance();appearanceDialog.showModal();
 }
 $('customize-button').addEventListener('click',openCustomize);
 $('close-customize').addEventListener('click',()=>appearanceDialog.close());
 $('palette-tab').addEventListener('click',()=>{appearanceCategory='palette';chosenAppearance=ChessThemes.palettes[0];updateAppearanceCards();previewAppearance();});
 $('skins-tab').addEventListener('click',()=>{appearanceCategory='skin';chosenAppearance=ChessThemes.skins[0];updateAppearanceCards();previewAppearance();});
 $('apply-appearance').addEventListener('click',async()=>{
  $('apply-appearance').disabled=true;
  try{
   const room=ChessGame.get().room;
   if(room&&room.role!=='spectator')await ChessGame.action('appearance',{appearance:chosenAppearance});
   save('baldchess_appearance',chosenAppearance);
   appearanceDialog.close();const g=ChessGame.get();renderBoard(g.room,g.selected,g.moves,g.premove);
  }catch(err){toast(serverError(err.message));}finally{$('apply-appearance').disabled=false;}
 });
 $('language-select').addEventListener('change',e=>setLanguage(e.target.value));
 $('language-in-game').addEventListener('change',e=>setLanguage(e.target.value));
 // Pointer-controlled dragging works with mouse and touch, without disabling click-to-move.
 let ignoreClick=false,drag=null;
 const boardEl=$('board');
 const cancelPointer=()=>{
  if(drag){drag.ghost?.remove();drag=null;ignoreClick=true;setTimeout(()=>{ignoreClick=false;},0);}
  ChessGame.cancelInteraction();
 };
 boardEl.addEventListener('contextmenu',e=>e.preventDefault());
 boardEl.addEventListener('pointerdown',e=>{
  if(e.button===2){e.preventDefault();cancelPointer();return;}
  if(e.button!==0&&e.pointerType==='mouse')return;
  const square=e.target.closest('.square');if(!square)return;
  const r=Number(square.dataset.r),c=Number(square.dataset.c),game=ChessGame.get(),p=game.room?.state.board[r]?.[c];
  if(!p||!ChessGame.controlled(p.color))return;
  drag={from:[r,c],startX:e.clientX,startY:e.clientY,moved:false,ghost:null,piece:p};
 });
 document.addEventListener('pointermove',e=>{
  if(!drag)return;const delta=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY);
  if(!drag.moved&&delta>7){
   drag.moved=true;const {room}=ChessGame.get();const ghost=document.createElement('div');ghost.className='drag-ghost';
   const ap=shownAppearance(room,drag.piece.color);ghost.appendChild(pieceSpan(drag.piece,ChessThemes.get(ap).skin,colorFor(drag.piece,room,ap)));document.body.appendChild(ghost);drag.ghost=ghost;
  }
  if(drag.moved){e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';}
 },{passive:false});
 document.addEventListener('pointerdown',e=>{
  if(e.button===2&&drag){e.preventDefault();cancelPointer();}
 },{capture:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drag)cancelPointer();});
 document.addEventListener('pointerup',e=>{
  if(e.button===2){if(drag)cancelPointer();return;}
  if(!drag)return;const current=drag;drag=null;current.ghost?.remove();if(!current.moved)return;
  ignoreClick=true;const el=document.elementFromPoint(e.clientX,e.clientY)?.closest('#board .square');
  if(el){const to=[Number(el.dataset.r),Number(el.dataset.c)];ChessGame.drag(current.from,to).catch(err=>toast(serverError(err.message)));}
  setTimeout(()=>{ignoreClick=false;},0);
 });
 document.addEventListener('pointercancel',()=>{if(drag)cancelPointer();});
 // Default is English, regardless of the operating-system language.
 language=load('baldchess_language','en');if(language!=='ru')language='en';showPlayerThemes=load('baldchess_show_player_themes','true')!=='false';
 $('show-player-themes').checked=showPlayerThemes;
 if($('sound-enabled'))$('sound-enabled').checked=ChessAudio.isEnabled();
 translate();
 ChessGame.bootstrap().then(result=>{
  if(result.joined){showWelcome=false;const resumed=ChessGame.get().room;saveNickname(resumed?.seats?.[resumed.role]);}
  else if(result.invite){$('join-code').value=result.invite;openJoin();}
  if(result.error)toast(serverError(result.error));const g=ChessGame.get();render(g.room,g.selected,g.moves,g.premove);
 }).catch(err=>toast(serverError(err.message)));
 setInterval(()=>ChessGame.poll(),1500);setInterval(updateClock,250);
})();
