// BaldChess 5.16.15: Wikimedia Cburnett classic SVG chess pieces (transparent, real vectors).
// BaldChess 5.16.14 — twelve approved classic figures faithfully traced into SVG paths.
// Rendering uses real scalable SVG paths, not font glyphs, embedded PNGs or transparent silhouettes.
const ChessPieces=(()=>{
 const CBURNETT={"bB":"<g id=\"black-bishop\" class=\"black bishop\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zm6-4c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z\" fill=\"#000\" stroke-linecap=\"butt\"/><path d=\"M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5\" stroke=\"#fff\" stroke-linejoin=\"miter\"/></g>","bK":"<g id=\"black-king\" class=\"black king\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22.5 11.63V6\" stroke-linejoin=\"miter\"/><path d=\"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5\" fill=\"#000\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\"/><path d=\"M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z\" fill=\"#000\"/><path d=\"M20 8h5\" stroke-linejoin=\"miter\"/><path d=\"M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0\" stroke=\"#fff\"/></g>","bN":"<g id=\"black-knight\" class=\"black knight\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18\" style=\"fill:#000000; stroke:#000000;\"/><path d=\"M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10\" style=\"fill:#000000; stroke:#000000;\"/><path d=\"M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z\" style=\"fill:#ececec; stroke:#ececec;\"/><path d=\"M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z\" transform=\"matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)\" style=\"fill:#ececec; stroke:#ececec;\"/><path d=\"M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z \" style=\"fill:#ececec; stroke:none;\"/></g>","bP":"<g id=\"black-pawn\" class=\"black pawn\"><path d=\"M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z\" fill=\"#000\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></g>","bQ":"<g id=\"black-queen\" class=\"black queen\" fill=\"#000\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"#000\" stroke=\"none\"><circle cx=\"6\" cy=\"12\" r=\"2.75\"/><circle cx=\"14\" cy=\"9\" r=\"2.75\"/><circle cx=\"22.5\" cy=\"8\" r=\"2.75\"/><circle cx=\"31\" cy=\"9\" r=\"2.75\"/><circle cx=\"39\" cy=\"12\" r=\"2.75\"/></g><path d=\"M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z\" stroke-linecap=\"butt\"/><path d=\"M11 38.5a35 35 1 0 0 23 0\" fill=\"none\" stroke-linecap=\"butt\"/><path d=\"M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0\" fill=\"none\" stroke=\"#fff\"/></g>","bR":"<g id=\"black-rook\" class=\"black rook\" fill=\"#000\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z\" stroke-linecap=\"butt\"/><path d=\"M14 29.5v-13h17v13H14z\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\"/><path d=\"M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z\" stroke-linecap=\"butt\"/><path d=\"M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1\" stroke-linejoin=\"miter\"/></g>","wB":"<g id=\"white-bishop\" class=\"white bishop\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"#fff\" stroke-linecap=\"butt\"><path d=\"M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z\"/></g><path d=\"M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5\" stroke-linejoin=\"miter\"/></g>","wK":"<g id=\"white-king\" class=\"white king\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22.5 11.63V6M20 8h5\" stroke-linejoin=\"miter\"/><path d=\"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5\" fill=\"#fff\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\"/><path d=\"M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z\" fill=\"#fff\"/><path d=\"M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0\"/></g>","wN":"<g id=\"white-knight\" class=\"white knight\" fill=\"none\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18\" style=\"fill:#ffffff; stroke:#000000;\"/><path d=\"M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10\" style=\"fill:#ffffff; stroke:#000000;\"/><path d=\"M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z\" style=\"fill:#000000; stroke:#000000;\"/><path d=\"M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z\" transform=\"matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)\" style=\"fill:#000000; stroke:#000000;\"/></g>","wP":"<g id=\"white-pawn\" class=\"white pawn\"><path d=\"M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z\" fill=\"#fff\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></g>","wQ":"<g id=\"white-queen\" class=\"white queen\" fill=\"#fff\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z\"/><path d=\"M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z\" stroke-linecap=\"butt\"/><path d=\"M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0\" fill=\"none\"/></g>","wR":"<g id=\"white-rook\" class=\"white rook\" fill=\"#fff\" fill-rule=\"evenodd\" stroke=\"#000\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5\" stroke-linecap=\"butt\"/><path d=\"M34 14l-3 3H14l-3-3\"/><path d=\"M31 17v12.5H14V17\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\"/><path d=\"M31 29.5l1.5 2.5h-20l1.5-2.5\"/><path d=\"M11 14h23\" fill=\"none\" stroke-linejoin=\"miter\"/></g>"};

 // Authentic 2006 Colin M.L. Burnett artwork from Wikimedia Commons.
 // Copy and adapt under the author's BSD 3-Clause license; see CBURNETT_LICENSE.txt.
 // Exact same SVG nodes are shipped in assets/classic-figures/*.svg.
 function classicSVG(kind,paint='#ffffff'){
   const hex=/^#[0-9a-f]{6}$/i.test(paint)?paint.toLowerCase():'#ffffff';
   const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
   const luminance=rgb.reduce((a,c,i)=>a+[.2126,.7152,.0722][i]*(c<=.04045?c/12.92:((c+.055)/1.055)**2.4),0);
   const dark=luminance<.28;
   const key=(dark?'b':'w')+kind;
   const frag=CBURNETT[key]||CBURNETT[(dark?'b':'w')+'P'];
   if(!frag)return '';
   // Honor four-player palette without losing internal engravings and contours.
   let art=frag;
   if(dark && hex!=='#101010' && hex!=='#000000'){
     art=art.replace(/#000000|#000(?![0-9a-f])/gi,hex);
   } else if(!dark && hex!=='#ffffff'){
     art=art.replace(/#ffffff|#fff(?![0-9a-f])/gi,hex);
   }
   return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" aria-hidden="true" focusable="false">${art}</svg>`;
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
