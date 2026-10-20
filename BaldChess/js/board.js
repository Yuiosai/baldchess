const ChessBoard=(()=>{
 const COLORS=['red','blue','yellow','green'];
 const NAMES={red:'Red',blue:'Blue',yellow:'Yellow',green:'Green'};
 const SYMBOLS={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟'};
 const PIECE_NAMES={K:'King',Q:'Queen',R:'Rook',B:'Bishop',N:'Knight',P:'Pawn'};
 const DIR={red:'up',blue:'right',yellow:'down',green:'left'};
 const seats=mode=>mode==='duel'?['red','yellow']:COLORS;
 const playable=(r,c,size=14)=>r>=0&&r<size&&c>=0&&c<size&&(size===8||!((r<3||r>10)&&(c<3||c>10)));
 const squareName=(r,c,size=14)=>'abcdefghijklmn'[c]+(size-r);
 const promote=(color,r,c,size=14)=>size===8?(color==='red'?r===0:r===7):({red:r<=6,blue:c>=7,yellow:r>=7,green:c<=6}[color]);
 function startBoard(mode='four'){
  const size=mode==='duel'?8:14,b=Array.from({length:size},()=>Array(size).fill(null)),order=['R','N','B','Q','K','B','N','R'];
  for(let i=0;i<8;i++){
   const cells=mode==='duel'?[[7,i,order[i],'red'],[6,i,'P','red'],[0,i,order[i],'yellow'],[1,i,'P','yellow']]:
    [[13,i+3,order[i],'red'],[12,i+3,'P','red'],[i+3,0,order[i],'blue'],[i+3,1,'P','blue'],[0,10-i,order[i],'yellow'],[1,10-i,'P','yellow'],[10-i,13,order[i],'green'],[10-i,12,'P','green']];
   for(const [r,c,type,color] of cells)b[r][c]={type,color};
  }return b;
 }
 return {COLORS,NAMES,SYMBOLS,PIECE_NAMES,DIR,seats,playable,squareName,promote,startBoard};
})();
