// BaldChess 5.16.10 — six hand-drawn, resolution-independent classic SVG shapes.
// No font glyphs, cropped screenshots, image masks or white-painted silhouettes.
const ChessPieces=(()=>{
 const classicShapes={
  K:`<g fill="@F@" stroke="@S@" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M60 28V18H54V12H60V5H68V12H74V18H68V28"/>
    <path d="M64 78 C45 77 31 79 31 79 C19 67 12 57 13 47 C14 32 25 28 36 31 C47 33 55 42 64 57 C73 42 81 33 92 31 C104 27 115 34 115 47 C116 58 106 69 97 79 C87 78 78 77 64 78Z"/>
    <path d="M64 57 C60 46 56 37 56 32 C56 24 59 21 64 21 C69 21 72 24 72 32 C72 38 68 49 64 57Z"/>
    <path d="M32 79 Q64 71 96 79 L99 103 Q64 113 29 103Z"/>
    <path d="M29 105 Q64 94 99 105 L99 112 Q64 123 29 112Z"/>
   </g>
   <g fill="none" stroke="@D@" stroke-width="2.9" stroke-linecap="round">
    <path d="M19 46 Q21 32 34 37 Q46 42 64 68 Q82 42 94 37 Q107 32 109 46"/>
    <path d="M32 88 Q64 79 96 88 M31 98 Q64 89 97 98 M31 110 Q64 101 97 110"/>
   </g>`,
  Q:`<g fill="@F@" stroke="@S@" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 35 L36 73 L32 23 L52 71 L64 15 L76 71 L96 23 L92 73 L111 35 L96 83 Q64 76 32 83Z"/>
    <circle cx="15" cy="33" r="6.2"/><circle cx="34" cy="20" r="6.2"/>
    <circle cx="64" cy="12" r="6.3"/><circle cx="94" cy="20" r="6.2"/><circle cx="113" cy="33" r="6.2"/>
    <path d="M32 82 Q64 74 96 82 L95 96 Q64 104 33 96Z"/>
    <path d="M34 98 Q64 91 94 98 L98 112 Q64 121 30 112Z"/>
   </g>
   <g stroke="@D@" stroke-width="2.6" stroke-linecap="round" fill="none">
    <path d="M33 89 Q64 81 95 89 M35 104 Q64 98 93 104 M31 112 Q64 106 97 112"/>
   </g>`,
  B:`<g fill="@F@" stroke="@S@" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="64" cy="15" r="8"/>
    <path d="M64 25 C43 35 36 51 38 65 C40 78 49 83 64 84 C79 83 88 77 90 65 C93 51 83 35 64 25Z"/>
    <path d="M48 82 Q64 78 80 82 L84 94 Q64 99 44 94Z"/>
    <path d="M43 94 Q64 87 85 94 L90 103 Q64 111 38 103Z"/>
    <path d="M44 104 Q51 110 64 110 Q77 110 84 104 Q93 109 110 112 Q119 115 119 119 Q107 122 88 117 Q77 114 64 115 Q51 114 40 117 Q20 122 9 119 Q9 115 18 112 Q35 109 44 104Z"/>
   </g>
   <path d="M64 43V66 M54 52H74" fill="none" stroke="@D@" stroke-width="5" stroke-linecap="round"/>
   <path d="M47 91 Q64 86 81 91" fill="none" stroke="@D@" stroke-width="3.3" stroke-linecap="round"/>`,
  N:`<g fill="@F@" stroke="@S@" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M31 24 L35 11 L44 17 L51 7 L57 17 C75 20 88 29 96 46 C104 62 107 81 107 115 H59 V91 C59 80 66 70 75 61 C66 64 55 70 46 81 C39 89 31 89 25 83 C20 78 22 73 27 66 C29 57 35 48 40 43 C35 41 32 36 31 24Z"/>
   </g>
   <path d="M44 36 Q49 31 53 34" fill="none" stroke="@S@" stroke-width="4.5" stroke-linecap="round"/>
   <path d="M40 57 C43 52 47 50 52 51" fill="none" stroke="@D@" stroke-width="4.7" stroke-linecap="round"/>
   <circle cx="46" cy="39" r="3.8" fill="@D@"/>
   <circle cx="29.8" cy="76.5" r="3" fill="@D@"/>
   <path d="M85 40 Q99 63 99 113" stroke="@D@" stroke-width="3.7" fill="none" stroke-linecap="round"/>
   <path d="M29 70 Q35 69 39 64" stroke="@S@" stroke-width="3.1" fill="none"/>`,
  R:`<g fill="@F@" stroke="@S@" stroke-width="4.6" stroke-linejoin="round">
    <path d="M24 20H38V27H51V20H77V27H90V20H104V42H24Z"/>
    <path d="M30 42 H98 L90 51 H38Z"/>
    <path d="M38 51 H90 V91 H38Z"/>
    <path d="M38 91H90L99 102H29Z"/>
    <path d="M24 102H104V111H24Z"/>
    <path d="M18 111H110V119H18Z"/>
   </g>
   <path d="M31 38H97 M36 47H92 M31 106H97 M21 115H107" stroke="@D@" stroke-width="2.7" fill="none" stroke-linecap="round"/>`,
  P:`<g fill="@F@" stroke="@S@" stroke-width="4.5" stroke-linejoin="round">
    <circle cx="64" cy="30" r="14"/>
    <path d="M53 42 C46 48 44 53 44 59 C44 65 48 69 54 73 C39 80 32 94 30 115 H98 C96 94 89 80 74 73 C80 69 84 65 84 59 C84 53 82 48 75 42 Z"/>
    <path d="M48 69 Q64 76 80 69 L78 76 Q64 82 50 76Z"/>
    <path d="M33 106 Q64 101 95 106 L98 115 H30Z"/>
   </g>`
 };
 // Four-player palettes and the two-player white/black pieces share one SVG
 // geometry. The fill comes from the selected theme, never from device fonts.
 function classicSVG(kind,paint='#ffffff'){
  const hex=/^#[0-9a-f]{6}$/i.test(paint)?paint.toLowerCase():'#ffffff';
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const lin=rgb.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  const luminance=.2126*lin[0]+.7152*lin[1]+.0722*lin[2];
  // Thin details in white/light on dark chessmen, black on light chessmen.
  const dark=luminance<.28;
  const detail=dark?'#ffffff':'#151515';
  const contour='#111111';
  const body=(classicShapes[kind]||classicShapes.P)
   .replaceAll('@F@',hex).replaceAll('@S@',contour).replaceAll('@D@',detail);
  return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;
 }
 const base={
  R:`<path d="M13 53h38l-4-9H17zM18 16h8v8h12v-8h8v22l-4 6H22l-4-6zM13 13h11v10H13zm15 0h9v10h-9zm13 0h11v10H41z"/><rect x="28" y="32" width="8" height="12" rx="3" fill="#172434" opacity=".8"/>`,
  N:`<path d="M16 53h36l-3-9-10-5 4-10 8-7-4-12-15 1-13 16 4 9-5 8z"/><path d="M31 14l-7-9-1 15z"/><path d="M39 24h5l-1 4h-5z" fill="#102533"/>`,
  B:`<path d="M17 53h30l-4-8H21zM24 44l-4-15 5-12 7-9 8 9 5 12-5 15z"/><path d="M32 14v26" stroke="#102837" stroke-width="3" opacity=".65"/>`,
  Q:`<path d="M12 53h40l-4-8H16zM16 42l-8-24 13 10 11-21 11 21 13-10-8 24z"/><circle cx="8" cy="16" r="4"/><circle cx="32" cy="6" r="4"/><circle cx="56" cy="16" r="4"/>`,
  K:`<path d="M12 53h40l-4-9H16zM19 42L13 20l11 8 8-13 8 13 11-8-6 22z"/><rect x="29" y="5" width="6" height="17" rx="1"/><rect x="24" y="10" width="16" height="6" rx="1"/>`,
  P:`<circle cx="32" cy="22" r="12"/><path d="M24 34h16l7 12H17zM13 53h38l-4-8H17z"/>`
 };
 const dragons={
  R:`<path d="M12 54h40l-4-9H16zM18 45V21h7v-8h7v8h7v-8h7v8h4v24zM22 12l5-9 5 9 6-9 5 9z"/><path d="M27 32h10v13H27z" fill="#132c38"/>`,
  N:`<path d="M10 52h45l-9-13 3-12-9-7-8-11-6 9-8-3 1 9-9 11 10-1-3 8z"/><path d="M27 15L16 4l2 17M35 15l5-13 4 18M46 28l12 2-10 6M20 41L7 43l9-8"/><circle cx="35" cy="25" r="2.4" fill="#141e2c"/><path d="M46 40l10 4-6 4z"/>`,
  B:`<path d="M15 54h34l-5-9H20zM32 6C18 21 18 29 26 39c-1-12 11-13 6-23 12 10 17 24 8 29H23C8 34 17 15 32 6z"/><path d="M32 28l-5 17h10z" fill="#11283a"/>`,
  Q:`<path d="M9 52h46l-6-10h-8l9-23-15 9-3-22-3 22-15-9 9 23h-8z"/><path d="M7 19L4 3l18 20M57 19l3-16-18 20"/><path d="M28 38l4-10 4 10-4 4z" fill="#173246"/>`,
  K:`<path d="M10 53h44l-4-10H14zM16 43L11 16l13 12 8-16 8 16 13-12-5 27z"/><path d="M11 16L7 4l13 12M53 16l4-12-13 12M32 12L27 2h10z"/><path d="M29 34h6l-3 6z" fill="#153244"/>`,
  P:`<path d="M14 53h36l-5-9H19zM20 38c-5-12 1-23 12-29 11 6 17 17 12 29l-12 7z"/><path d="M24 27l8-7 7 8-7-2-5 10" fill="#163747"/><circle cx="36" cy="19" r="2" fill="#172535"/>`
 };
 const fortress={
  R:dragons.R,
  N:`<path d="M14 53h38l-5-11-7-8 6-11-6-13-13 2-12 17 8 8-5 5z"/><path d="M27 12l-3-9 12 6-2 5M40 21l12 6-11 6"/><rect x="30" y="22" width="5" height="5" fill="#0e2634"/>`,
  B:`<path d="M14 53h36l-5-9H19zM23 44l-4-25 13-13 13 13-4 25z"/><path d="M29 17h6v20h-6z" fill="#163242"/><path d="M19 19L32 6l13 13z"/>`,
  Q:`<path d="M11 53h42l-5-10H16zM17 42V24l7-7 8 7 8-7 7 7v18zM8 21V9h10v12M46 21V9h10v12"/><path d="M28 31h8v11h-8z" fill="#142d38"/>`,
  K:`<path d="M10 53h44l-6-10H16zM15 43V17h8v8h7v-8h8v8h7v-8h5v26z"/><path d="M29 9V3h6v6h6v6H23V9z"/><path d="M28 32h8v11h-8z" fill="#162f41"/>`,
  P:`<path d="M16 53h32l-5-10H21zM18 18l14-8 14 8v15L32 45 18 33z"/><path d="M27 20h10v15H27z" fill="#153243"/>`
 };
 const cosmos={
  R:`<path d="M24 7h16l7 31-15 12-15-12zM24 45h16l9 9H15z"/><circle cx="32" cy="26" r="7" fill="#142b3d"/><path d="M18 17l-9-6v18l9 5M46 17l9-6v18l-9 5"/>`,
  N:`<path d="M10 44C6 24 19 5 43 7c-18 8-21 28-11 36l16 10H15z"/><path d="M38 9l11-8-4 16 10 7-15 1z"/><circle cx="35" cy="23" r="3" fill="#12253a"/>`,
  B:`<path d="M13 53h38l-6-10H19zM23 36C9 19 38-1 44 7c-6 7-2 15-6 25l-6 12z"/><path d="M29 16l-8 23 15-7" fill="#102739"/>`,
  Q:`<circle cx="32" cy="25" r="16"/><ellipse cx="32" cy="25" rx="29" ry="10" transform="rotate(-25 32 25)" fill="none" stroke="currentColor" stroke-width="5"/><path d="M17 52h30l-4-9H21z"/>`,
  K:`<path d="M32 3l7 17 17 7-17 7-7 17-7-17-17-7 17-7z"/><path d="M22 50h20l6 5H16z"/><circle cx="32" cy="27" r="7" fill="#132d41"/>`,
  P:`<circle cx="32" cy="25" r="16"/><path d="M16 40h32l5 13H11z"/><circle cx="39" cy="20" r="6" fill="#162a3b"/>`
 };
 const mystic={
  R:`<path d="M13 54h38l-6-10H19zM19 44l3-28 10-10 10 10 3 28z"/><path d="M29 19h6l-3 13z" fill="#102737"/><circle cx="32" cy="38" r="4" fill="#142b40"/>`,
  N:`<path d="M12 53h41l-11-10 12-13-14 2 8-21-17 12-2-19-10 20-8 2 12 12z"/><path d="M29 27l9-8-3 11" fill="#152a41"/>`,
  B:`<path d="M13 54h38l-4-9H17zM32 5c-21 17-21 31 0 40 21-9 21-23 0-40z"/><path d="M32 14c-8 12-8 20 0 26 8-6 8-14 0-26z" fill="#152e41"/>`,
  Q:`<path d="M13 54h38l-5-9H18zM28 6C9 15 10 37 24 43h19C21 34 29 18 45 8 40 3 32 2 28 6z"/><path d="M45 9l9-6-3 12"/>`,
  K:`<path d="M10 53h44l-5-9H15zM17 44l-6-27 14 8 7-17 7 17 14-8-6 27z"/><path d="M32 17l-5 9 5 8 5-8z" fill="#142638"/><circle cx="32" cy="7" r="5"/>`,
  P:`<path d="M14 54h36l-5-9H19zM32 8l16 19-16 18-16-18z"/><path d="M32 19l7 8-7 8-7-8z" fill="#173246"/>`
 };

 const celestial={
  R:`<path d="M13 54h38l-4-7H17zM18 45l4-30h7l3-8 3 8h7l4 30z"/><path d="M23 21l9 6 9-6M23 34l9 6 9-6" fill="none" stroke="#503d2b" stroke-width="2"/><path d="M32 10l4-8 5 6-9 6-9-6 5-6z"/>`,
  N:`<path d="M11 54h44l-7-10-8-6 9-16-7-11-15 1-13 17 11 6-6 9z"/><path d="M19 21l-7-18 17 11M41 17l9-15-3 24M45 28l12-1-12 7"/><path d="M31 22l8-3-3 9-7-1z" fill="#5b4239"/>`,
  B:`<path d="M13 54h38l-5-8H18zM21 45l-5-16L32 5l16 24-5 16z"/><path d="M32 7l-6 21 6 17 6-17z" fill="#d6ac7a" opacity=".55"/><path d="M32 16l-4 13 4 7 4-7z" fill="#493344"/>`,
  Q:`<path d="M11 54h42l-5-8H16zM15 43L9 18l14 8 9-19 9 19 14-8-6 25z"/><path d="M9 18l-6-9 13 6M55 18l6-9-13 6M32 7V1"/><path d="M22 34l10 7 10-7" fill="none" stroke="#9e704c" stroke-width="2"/>`,
  K:`<path d="M11 54h42l-5-8H16zM18 45l-7-25 12 7 9-13 9 13 12-7-7 25z"/><path d="M32 3l4 8h8l-8 6-4 8-4-8-8-6h8z"/><path d="M22 35l10 7 10-7" fill="none" stroke="#9e704c" stroke-width="2"/>`,
  P:`<path d="M13 54h38l-5-8H18zM19 46l7-15h12l7 15z"/><path d="M32 7l16 17-16 13-16-13z"/><path d="M32 14l7 10-7 6-7-6z" fill="#674e47"/>`
 };
 const abyss={
  R:`<path d="M12 54h40l-6-9H18zM17 44l-3-24 8 3-1-14 11 9 11-9-1 14 8-3-3 24z"/><path d="M25 28l7 7 7-7-7-3z" fill="#1a1631"/>`,
  N:`<path d="M10 54h44l-10-13 8-11-10 1 8-19-16 6-1-14-10 17-12-4 9 15-8 10z"/><path d="M24 24l7 3 4-9 6 4-7 12z" fill="#201c30"/><path d="M36 13l7-12M19 21l-11-9M47 38l12 6" stroke="currentColor" stroke-width="3"/>`,
  B:`<path d="M12 54h40l-5-9H17zM17 39l15-35 15 35-15 8z"/><path d="M32 10l-5 18 5 15 5-15z" fill="#251e3c"/><path d="M21 38l11 9 11-9" fill="none" stroke="#8f769e" stroke-width="2"/>`,
  Q:`<path d="M10 54h44l-5-9H15zM16 44L7 15l16 13 9-21 9 21 16-13-9 29z"/><path d="M7 15L5 3l12 15M57 15l2-12-12 15"/><path d="M32 15l-5 16 5 8 5-8z" fill="#241934"/>`,
  K:`<path d="M10 54h44l-5-9H15zM18 44l-6-28 12 9 8-15 8 15 12-9-6 28z"/><path d="M32 3l-6 8 6 8 6-8z"/><path d="M26 32l6 7 6-7-6-5z" fill="#17162c"/>`,
  P:`<path d="M13 54h38l-6-9H19zM20 44l-7-16 19-23 19 23-7 16z"/><path d="M23 29l9-14 9 14-9 13z" fill="#241d35"/><path d="M16 21l-9 1 8 12M48 21l9 1-8 12" stroke="currentColor" stroke-width="2"/>`
 };
 const pixel={
  R:'00111100/00100100/11111111/11100111/01111110/01100110/11111111/11111111',
  N:'00111100/01111110/11111110/11001110/01111100/00111000/01111110/11111111',
  B:'00011000/00111100/01111110/01111110/00111100/00111100/01111110/11111111',
  Q:'10011001/11011011/11111111/01111110/01111110/00111100/01111110/11111111',
  K:'00011000/00111100/00011000/11111111/01111110/00111100/01111110/11111111',
  P:'00000000/00111100/01111110/01111110/00111100/00111100/01111110/11111111'
 };
 function get(kind,skin,owner='red',paint=null){
  if(skin==='classic'||!skin){
   const defaultPaint={red:'#ffffff',yellow:'#101010',blue:'#215c99',green:'#73b680'};
   const wrap=document.createElement('span');
   wrap.className='art art-classic';
   wrap.innerHTML=classicSVG(kind,paint||defaultPaint[owner]||'#ffffff');
   return wrap;
  }
  // Other fantasy/skin artworks remain unchanged.
  // The classic set is real inline SVG too: no OS-dependent Unicode chess fonts.
  let shapes={dragons,fortress,cosmos,mystic,celestial,abyss};let inner=shapes[skin]?.[kind]||base[kind];
  if(skin==='pixel')inner=pixel[kind].split('/').map((row,y)=>[...row].map((x,j)=>x==='1'?`<rect x="${j*7+4}" y="${y*7+4}" width="7" height="7"/>`:'' ).join('')).join('');
  const wrap=document.createElement('span');wrap.className='art';wrap.innerHTML=`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="pieceMetal" x1="0" y1="0" x2="0.65" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".78"/><stop offset=".22" stop-color="currentColor"/><stop offset=".55" stop-color="currentColor"/><stop offset="1" stop-color="#101523" stop-opacity=".93"/></linearGradient></defs><g fill="currentColor">${inner}</g><path d="M15 54h34" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  return wrap;
 }
 return {get};
})();
