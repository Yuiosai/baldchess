// One appearance changes both the chessboard and the chessmen.
// Palettes keep classic silhouettes; art skins use their own vector artwork.
const ChessThemes=(()=>{
 const themes={
  'palette:classic':{en:'Classic',ru:'Классика',light:'#ebd9bb',dark:'#966f50',edge:'#5c483e',piece:{red:'#f2e4c8',yellow:'#6c4f3b',blue:'#456b86',green:'#6a7f48'},uniformPiece:{red:'#f4d2ae',yellow:'#73553f',blue:'#2d628b',green:'#5e7c36'},skin:'classic'},
  'palette:forest':{en:'Forest',ru:'Лес',light:'#e6e7ca',dark:'#719078',edge:'#344e48',piece:{red:'#d8c08f',yellow:'#4e6959',blue:'#567884',green:'#a4bc73'},uniformPiece:{red:'#e0bc82',yellow:'#476454',blue:'#386e86',green:'#9cbc54'},skin:'classic'},
  'palette:marble':{en:'Marble',ru:'Мрамор',light:'#e9edf0',dark:'#98a8af',edge:'#687981',piece:{red:'#c79d86',yellow:'#65727b',blue:'#305f80',green:'#7b6b55'},uniformPiece:{red:'#d09b7f',yellow:'#626e78',blue:'#356b89',green:'#6c5c46'},skin:'classic'},
  'palette:midnight':{en:'Midnight',ru:'Полночь',light:'#5a6479',dark:'#2b344a',edge:'#131b2c',piece:{red:'#e3c9a8',yellow:'#d9e3ef',blue:'#7aa8d6',green:'#9ec9b0'},uniformPiece:{red:'#e8c08d',yellow:'#f1f5fb',blue:'#77afe8',green:'#93d5af'},skin:'classic'},
  'palette:royal':{en:'Royal',ru:'Королевская',light:'#d4baa0',dark:'#745265',edge:'#442637',piece:{red:'#efc0a6',yellow:'#89649a',blue:'#6c78bd',green:'#7fa17d'},uniformPiece:{red:'#f3b897',yellow:'#805b93',blue:'#5566c4',green:'#6d9d67'},skin:'classic'},
  'palette:ice':{en:'Ice',ru:'Лёд',light:'#e4edf7',dark:'#8bb0cb',edge:'#3d637f',piece:{red:'#ffffff',yellow:'#557d96',blue:'#4f82bf',green:'#6a9f97'},uniformPiece:{red:'#fefefe',yellow:'#4e7891',blue:'#377cc6',green:'#4b9f92'},skin:'classic'},
  'skin:dragons':{en:'Dragon Realm',ru:'Царство драконов',light:'#ab8d77',dark:'#543e49',edge:'#2a1e30',piece:{red:'#d87d62',yellow:'#c9a15b',blue:'#6a84a8',green:'#85915b'},uniformPiece:{red:'#e07453',yellow:'#cf9b42',blue:'#5c81b5',green:'#7f9745'},skin:'dragons',art:'dragons'},
  'skin:fortress':{en:'Iron Citadel',ru:'Железная цитадель',light:'#a7b2bd',dark:'#586b79',edge:'#222f41',piece:{red:'#b8866b',yellow:'#ebe6d8',blue:'#6f8f9f',green:'#7d9b88'},uniformPiece:{red:'#bf7f5d',yellow:'#faf6ec',blue:'#5e869c',green:'#6d9a81'},skin:'fortress',art:'fortress'},
  'skin:cosmos':{en:'Galactic',ru:'Галактика',light:'#50617e',dark:'#222943',edge:'#101629',piece:{red:'#d98fb6',yellow:'#d9c68c',blue:'#87b4e8',green:'#86d0c1'},uniformPiece:{red:'#e58ab7',yellow:'#e2cb71',blue:'#7ebcff',green:'#76dbc7'},skin:'cosmos',art:'cosmos'},
  'skin:mystic':{en:'Arcane',ru:'Аркана',light:'#8d7fa3',dark:'#473c66',edge:'#2d2248',piece:{red:'#f0a7c4',yellow:'#ceb5ff',blue:'#9dbdf2',green:'#9ed8b7'},uniformPiece:{red:'#f69fc5',yellow:'#d7b3ff',blue:'#97befc',green:'#90dfb1'},skin:'mystic',art:'mystic'},
  'skin:celestial':{en:'Celestial',ru:'Небесный орден',light:'#e4d6b2',dark:'#9e895c',edge:'#60543d',piece:{red:'#f4dfc2',yellow:'#666e8b',blue:'#88a8c8',green:'#b58f63'},uniformPiece:{red:'#f9dcc0',yellow:'#636d89',blue:'#79a4ce',green:'#b4874e'},skin:'celestial',art:'celestial'},
  'skin:abyss':{en:'Abyss',ru:'Бездна',light:'#7d7b8e',dark:'#343247',edge:'#161625',piece:{red:'#d49ab0',yellow:'#d3c5e2',blue:'#8aa4cf',green:'#8bb9a3'},uniformPiece:{red:'#dd95b2',yellow:'#ddd0ee',blue:'#86a8d9',green:'#86c2a0'},skin:'abyss',art:'abyss'},
 };
 const palettes=Object.keys(themes).filter(x=>x.startsWith('palette:'));
 const skins=Object.keys(themes).filter(x=>x.startsWith('skin:'));
 const get=id=>themes[id]||themes['palette:classic'];
 const owner=(r,c,size)=>{if(size===8)return r<4?'yellow':'red';const mid=(size-1)/2,dx=c-mid,dy=r-mid;return Math.abs(dy)>=Math.abs(dx)?dy>=0?'red':'yellow':dx<0?'blue':'green';};
 return {themes,palettes,skins,get,owner};
})();
