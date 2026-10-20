// BaldChess piece renderer.
// Clean vector silhouettes with a little more depth, soft highlights and shadows.
const ChessPieces=(()=>{
 let uid=0;
 const base={
  R:`<path d="M13 53h38l-4-9H17zM18 16h8v8h12v-8h8v22l-4 6H22l-4-6zM13 13h11v10H13zm15 0h9v10h-9zm13 0h11v10H41z"/><rect x="28" y="32" width="8" height="12" rx="3" fill="#172434" opacity=".24"/>`,
  N:`<path d="M16 53h36l-3-9-10-5 4-10 8-7-4-12-15 1-13 16 4 9-5 8z"/><path d="M31 14l-7-9-1 15z"/><path d="M39 24h5l-1 4h-5z" fill="#102533" opacity=".26"/>`,
  B:`<path d="M17 53h30l-4-8H21zM24 44l-4-15 5-12 7-9 8 9 5 12-5 15z"/><path d="M32 14v26" stroke="#102837" stroke-width="3" opacity=".25"/>`,
  Q:`<path d="M12 53h40l-4-8H16zM16 42l-8-24 13 10 11-21 11 21 13-10-8 24z"/><circle cx="8" cy="16" r="4"/><circle cx="32" cy="6" r="4"/><circle cx="56" cy="16" r="4"/>`,
  K:`<path d="M12 53h40l-4-9H16zM19 42L13 20l11 8 8-13 8 13 11-8-6 22z"/><rect x="29" y="5" width="6" height="17" rx="1"/><rect x="24" y="10" width="16" height="6" rx="1"/>`,
  P:`<circle cx="32" cy="22" r="12"/><path d="M24 34h16l7 12H17zM13 53h38l-4-8H17z"/>`
 };
 const dragons={
  R:`<path d="M12 54h40l-4-9H16zM18 45V21h7v-8h7v8h7v-8h7v8h4v24zM22 12l5-9 5 9 6-9 5 9z"/><path d="M27 32h10v13H27z" fill="#132c38" opacity=".25"/>`,
  N:`<path d="M10 52h45l-9-13 3-12-9-7-8-11-6 9-8-3 1 9-9 11 10-1-3 8z"/><path d="M27 15L16 4l2 17M35 15l5-13 4 18M46 28l12 2-10 6M20 41L7 43l9-8"/><circle cx="35" cy="25" r="2.4" fill="#141e2c" opacity=".33"/><path d="M46 40l10 4-6 4z"/>`,
  B:`<path d="M15 54h34l-5-9H20zM32 6C18 21 18 29 26 39c-1-12 11-13 6-23 12 10 17 24 8 29H23C8 34 17 15 32 6z"/><path d="M32 28l-5 17h10z" fill="#11283a" opacity=".26"/>`,
  Q:`<path d="M9 52h46l-6-10h-8l9-23-15 9-3-22-3 22-15-9 9 23h-8z"/><path d="M7 19L4 3l18 20M57 19l3-16-18 20"/><path d="M28 38l4-10 4 10-4 4z" fill="#173246" opacity=".25"/>`,
  K:`<path d="M10 53h44l-4-10H14zM16 43L11 16l13 12 8-16 8 16 13-12-5 27z"/><path d="M11 16L7 4l13 12M53 16l4-12-13 12M32 12L27 2h10z"/><path d="M29 34h6l-3 6z" fill="#153244" opacity=".28"/>`,
  P:`<path d="M14 53h36l-5-9H19zM20 38c-5-12 1-23 12-29 11 6 17 17 12 29l-12 7z"/><path d="M24 27l8-7 7 8-7-2-5 10" fill="#163747" opacity=".26"/><circle cx="36" cy="19" r="2" fill="#172535" opacity=".28"/>`
 };
 const fortress={
  R:dragons.R,
  N:`<path d="M14 53h38l-5-11-7-8 6-11-6-13-13 2-12 17 8 8-5 5z"/><path d="M27 12l-3-9 12 6-2 5M40 21l12 6-11 6"/><rect x="30" y="22" width="5" height="5" fill="#0e2634" opacity=".26"/>`,
  B:`<path d="M14 53h36l-5-9H19zM23 44l-4-25 13-13 13 13-4 25z"/><path d="M29 17h6v20h-6z" fill="#163242" opacity=".28"/><path d="M19 19L32 6l13 13z"/>`,
  Q:`<path d="M11 53h42l-5-10H16zM17 42V24l7-7 8 7 8-7 7 7v18zM8 21V9h10v12M46 21V9h10v12"/><path d="M28 31h8v11h-8z" fill="#142d38" opacity=".28"/>`,
  K:`<path d="M10 53h44l-6-10H16zM15 43V17h8v8h7v-8h8v8h7v-8h5v26z"/><path d="M29 9V3h6v6h6v6H23V9z"/><path d="M28 32h8v11h-8z" fill="#162f41" opacity=".28"/>`,
  P:`<path d="M16 53h32l-5-10H21zM18 18l14-8 14 8v15L32 45 18 33z"/><path d="M27 20h10v15H27z" fill="#153243" opacity=".26"/>`
 };
 const cosmos={
  R:`<path d="M24 7h16l7 31-15 12-15-12zM24 45h16l9 9H15z"/><circle cx="32" cy="26" r="7" fill="#142b3d" opacity=".24"/><path d="M18 17l-9-6v18l9 5M46 17l9-6v18l-9 5"/>`,
  N:`<path d="M10 44C6 24 19 5 43 7c-18 8-21 28-11 36l16 10H15z"/><path d="M38 9l11-8-4 16 10 7-15 1z"/><circle cx="35" cy="23" r="3" fill="#12253a" opacity=".25"/>`,
  B:`<path d="M13 53h38l-6-10H19zM23 36C9 19 38-1 44 7c-6 7-2 15-6 25l-6 12z"/><path d="M29 16l-8 23 15-7" fill="#102739" opacity=".24"/>`,
  Q:`<circle cx="32" cy="25" r="16"/><ellipse cx="32" cy="25" rx="29" ry="10" transform="rotate(-25 32 25)" fill="none" stroke="currentColor" stroke-width="5"/><path d="M17 52h30l-4-9H21z"/>`,
  K:`<path d="M32 3l7 17 17 7-17 7-7 17-7-17-17-7 17-7z"/><path d="M22 50h20l6 5H16z"/><circle cx="32" cy="27" r="7" fill="#132d41" opacity=".24"/>`,
  P:`<circle cx="32" cy="25" r="16"/><path d="M16 40h32l5 13H11z"/><circle cx="39" cy="20" r="6" fill="#162a3b" opacity=".24"/>`
 };
 const mystic={
  R:`<path d="M13 54h38l-6-10H19zM19 44l3-28 10-10 10 10 3 28z"/><path d="M29 19h6l-3 13z" fill="#102737" opacity=".26"/><circle cx="32" cy="38" r="4" fill="#142b40" opacity=".24"/>`,
  N:`<path d="M12 53h41l-11-10 12-13-14 2 8-21-17 12-2-19-10 20-8 2 12 12z"/><path d="M29 27l9-8-3 11" fill="#152a41" opacity=".26"/>`,
  B:`<path d="M13 54h38l-4-9H17zM32 5c-21 17-21 31 0 40 21-9 21-23 0-40z"/><path d="M32 14c-8 12-8 20 0 26 8-6 8-14 0-26z" fill="#152e41" opacity=".24"/>`,
  Q:`<path d="M13 54h38l-5-9H18zM28 6C9 15 10 37 24 43h19C21 34 29 18 45 8 40 3 32 2 28 6z"/><path d="M45 9l9-6-3 12"/>`,
  K:`<path d="M10 53h44l-5-9H15zM17 44l-6-27 14 8 7-17 7 17 14-8-6 27z"/><path d="M32 17l-5 9 5 8 5-8z" fill="#142638" opacity=".24"/><circle cx="32" cy="7" r="5"/>`,
  P:`<path d="M14 54h36l-5-9H19zM32 8l16 19-16 18-16-18z"/><path d="M32 19l7 8-7 8-7-8z" fill="#173246" opacity=".25"/>`
 };
 const celestial={
  R:`<path d="M13 54h38l-4-7H17zM18 45l4-30h7l3-8 3 8h7l4 30z"/><path d="M23 21l9 6 9-6M23 34l9 6 9-6" fill="none" stroke="#503d2b" stroke-width="2" opacity=".28"/><path d="M32 10l4-8 5 6-9 6-9-6 5-6z"/>`,
  N:`<path d="M11 54h44l-7-10-8-6 9-16-7-11-15 1-13 17 11 6-6 9z"/><path d="M19 21l-7-18 17 11M41 17l9-15-3 24M45 28l12-1-12 7"/><path d="M31 22l8-3-3 9-7-1z" fill="#5b4239" opacity=".28"/>`,
  B:`<path d="M13 54h38l-5-8H18zM21 45l-5-16L32 5l16 24-5 16z"/><path d="M32 7l-6 21 6 17 6-17z" fill="#d6ac7a" opacity=".22"/><path d="M32 16l-4 13 4 7 4-7z" fill="#493344" opacity=".28"/>`,
  Q:`<path d="M11 54h42l-5-8H16zM15 43L9 18l14 8 9-19 9 19 14-8-6 25z"/><path d="M9 18l-6-9 13 6M55 18l6-9-13 6M32 7V1"/><path d="M22 34l10 7 10-7" fill="none" stroke="#9e704c" stroke-width="2" opacity=".3"/>`,
  K:`<path d="M11 54h42l-5-8H16zM18 45l-7-25 12 7 9-13 9 13 12-7-7 25z"/><path d="M32 3l4 8h8l-8 6-4 8-4-8-8-6h8z"/><path d="M22 35l10 7 10-7" fill="none" stroke="#9e704c" stroke-width="2" opacity=".3"/>`,
  P:`<path d="M13 54h38l-5-8H18zM19 46l7-15h12l7 15z"/><path d="M32 7l16 17-16 13-16-13z"/><path d="M32 14l7 10-7 6-7-6z" fill="#674e47" opacity=".28"/>`
 };
 const abyss={
  R:`<path d="M12 54h40l-6-9H18zM17 44l-3-24 8 3-1-14 11 9 11-9-1 14 8-3-3 24z"/><path d="M25 28l7 7 7-7-7-3z" fill="#1a1631" opacity=".28"/>`,
  N:`<path d="M10 54h44l-10-13 8-11-10 1 8-19-16 6-1-14-10 17-12-4 9 15-8 10z"/><path d="M24 24l7 3 4-9 6 4-7 12z" fill="#201c30" opacity=".28"/><path d="M36 13l7-12M19 21l-11-9M47 38l12 6" stroke="currentColor" stroke-width="3"/>`,
  B:`<path d="M12 54h40l-5-9H17zM17 39l15-35 15 35-15 8z"/><path d="M32 10l-5 18 5 15 5-15z" fill="#251e3c" opacity=".28"/><path d="M21 38l11 9 11-9" fill="none" stroke="#8f769e" stroke-width="2" opacity=".4"/>`,
  Q:`<path d="M10 54h44l-5-9H15zM16 44L7 15l16 13 9-21 9 21 16-13-9 29z"/><path d="M7 15L5 3l12 15M57 15l2-12-12 15"/><path d="M32 15l-5 16 5 8 5-8z" fill="#241934" opacity=".28"/>`,
  K:`<path d="M10 54h44l-5-9H15zM18 44l-6-28 12 9 8-15 8 15 12-9-6 28z"/><path d="M32 3l-6 8 6 8 6-8z"/><path d="M26 32l6 7 6-7-6-5z" fill="#17162c" opacity=".28"/>`,
  P:`<path d="M13 54h38l-6-9H19zM20 44l-7-16 19-23 19 23-7 16z"/><path d="M23 29l9-14 9 14-9 13z" fill="#241d35" opacity=".28"/><path d="M16 21l-9 1 8 12M48 21l9 1-8 12" stroke="currentColor" stroke-width="2"/>`
 };
 const pixel={
  R:'00111100/00100100/11111111/11100111/01111110/01100110/11111111/11111111',
  N:'00111100/01111110/11111110/11001110/01111100/00111000/01111110/11111111',
  B:'00011000/00111100/01111110/01111110/00111100/00111100/01111110/11111111',
  Q:'10011001/11011011/11111111/01111110/01111110/00111100/01111110/11111111',
  K:'00011000/00111100/00011000/11111111/01111110/00111100/01111110/11111111',
  P:'00000000/00111100/01111110/01111110/00111100/00111100/01111110/11111111'
 };
 const shapeSets={classic:base,dragons,fortress,cosmos,mystic,celestial,abyss};
 function pixelArt(kind){
  return pixel[kind].split('/').map((row,y)=>[...row].map((x,j)=>x==='1'?`<rect x="${j*7+4}" y="${y*7+4}" width="7" height="7" rx="1.1" ry="1.1"/>`:'' ).join('')).join('');
 }
 function wrapSVG(inner,skin='classic'){
  const id=++uid;
  const metal = skin==='classic' || skin==='fortress' || skin==='celestial';
  const outlineOpacity = skin==='pixel' ? '.22' : '.34';
  const bottomShade = skin==='abyss' ? '.42' : skin==='cosmos' ? '.32' : '.28';
  const sheenOpacity = skin==='pixel' ? '.12' : metal ? '.22' : '.17';
  const rimOpacity = skin==='pixel' ? '.14' : '.18';
  const svg=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
   <defs>
    <linearGradient id="fill-${id}" x1="0.18" y1="0.06" x2="0.84" y2="0.98">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".50"/>
      <stop offset=".16" stop-color="currentColor" stop-opacity=".98"/>
      <stop offset=".54" stop-color="currentColor" stop-opacity=".95"/>
      <stop offset="1" stop-color="#0b111a" stop-opacity=".72"/>
    </linearGradient>
    <linearGradient id="shade-${id}" x1="0.45" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset=".55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="${bottomShade}"/>
    </linearGradient>
    <radialGradient id="shine-${id}" cx="26%" cy="16%" r="62%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${sheenOpacity}"/>
      <stop offset=".42" stop-color="#ffffff" stop-opacity=".08"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0.6" dy="1.2" stdDeviation="1.3" flood-color="#050a11" flood-opacity=".46"/>
    </filter>
   </defs>
   <g filter="url(#shadow-${id})">
    <g fill="url(#fill-${id})" stroke="#0a1018" stroke-width="1.05" stroke-opacity="${outlineOpacity}" stroke-linejoin="round">${inner}</g>
    <g fill="url(#shine-${id})">${inner}</g>
    <g fill="url(#shade-${id})" opacity=".72">${inner}</g>
    <path d="M18 10c8-5 19-5 28 .7" fill="none" stroke="#ffffff" stroke-opacity="${rimOpacity}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M14 53h36" fill="none" stroke="#ffffff" stroke-opacity=".24" stroke-width="1.7" stroke-linecap="round"/>
   </g>
  </svg>`;
  const wrap=document.createElement('span');
  wrap.className='art art-'+skin;
  wrap.innerHTML=svg;
  return wrap;
 }
 function get(kind,skin='classic'){
  if(skin==='pixel')return wrapSVG(pixelArt(kind),'pixel');
  const inner=(shapeSets[skin]||base)[kind]||base[kind];
  return wrapSVG(inner,skin);
 }
 return {get};
})();
