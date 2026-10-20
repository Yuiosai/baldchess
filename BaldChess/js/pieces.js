// BaldChess — hand-drawn, cartoon-chess vector set.
// Each style uses the same readable chess silhouette: broad pedestal, soft
// highlights, inked contours. Custom skins add restrained surface details.
// No raster artwork, external fonts or generated image assets are required.
const ChessPieces = (() => {
  let nextId = 0;

  // Elements in a 100 x 116 coordinate system. By sharing the same base and
  // shoulder height, every chessman sits at the same level on an 8x8 / 14x14 board.
  const shell = (d, cls='') => `<path class="shell ${cls}" d="${d}"/>`;
  const stroke = (d, cls='') => `<path class="ink ${cls}" d="${d}"/>`;
  const light = (d, cls='') => `<path class="highlight ${cls}" d="${d}"/>`;
  const shade = (d, cls='') => `<path class="shade ${cls}" d="${d}"/>`;

  const body = {
    // Normal chessmen and the bishop: wider shoulders, narrow middle, shared pedestal.
    narrow: `${shell('M39 48 Q41 63 33 81 H67 Q59 63 61 48Z','torso')}
             ${shade('M56 52 Q61 66 65 80 H56 Q58 65 56 52Z')}
             ${light('M43 54 Q44 67 39 76','gloss')}`,
    // Slightly stronger lower half suits castle and horse.
    sturdy: `${shell('M35 48 Q37 65 29 81 H71 Q63 65 65 48Z','torso')}
             ${shade('M59 52 Q65 67 69 80 H59 Q62 64 59 52Z')}
             ${light('M40 54 Q41 66 36 77','gloss')}`
  };

  const base = `
    ${shell('M19 98 H81 Q84 98 84 101 V106 Q84 110 79 110 H21 Q16 110 16 106 V101 Q16 98 19 98 Z','bottom-rim')}
    ${shade('M71 100H81V106H71Z')}
    ${light('M22 102H49','rim-shine')}
    ${shell('M33 79 H67 Q69 85 76 90 L83 96 Q86 100 79 101 H21 Q14 100 17 96 L24 90 Q31 85 33 79 Z','foot')}
    ${shade('M64 82 Q67 89 76 94 L80 97 H64 Q71 92 64 82 Z')}
    ${light('M31 90 Q26 93 24 96 Q35 98 43 96','foot-shine')}
    ${shell('M32 76H68 Q73 76 74 79 Q75 82 71 84 H29 Q25 82 26 79 Q27 76 32 76Z','lower-band')}
    ${light('M31 79H58','band-shine')}
  `;

  const heads = {
    P: `
      ${shell('M42 43H58 Q58 59 67 81H33 Q42 59 42 43Z','torso')}
      ${shade('M56 47Q57 65 65 79H57Z')}
      ${light('M45 52Q45 64 40 76','gloss')}
      ${shell('M38 41H62 Q65 41 66 44 Q66 48 62 48 H38 Q34 48 34 44 Q35 41 38 41Z','neck-band')}
      ${light('M39 44H54')}
      <circle class="shell orb" cx="50" cy="24" r="17"/>
      ${shade('M58 11 Q70 23 60 36 Q68 34 67 24 Q66 15 58 11Z')}
      ${light('M40 16Q44 12 48 12','orb-shine')}
    `,
    R: `
      ${body.sturdy}
      ${shell('M32 48H68 Q71 48 72 51 V56 Q72 59 68 59 H32 Q28 59 28 56 V51 Q28 48 32 48Z','top-band')}
      ${light('M33 52H57')}
      ${shell('M28 15 H39 V24 H46 V15 H54 V24 H61 V15 H72 V44 Q72 48 67 48 H33 Q28 48 28 44Z','rook-top')}
      ${shade('M62 20H69V43H62Z')}
      ${light('M33 20V40 M35 41H54','tower-gloss')}
      ${stroke('M40 26H60','parapet')}
    `,
    B: `
      ${body.narrow}
      ${shell('M33 56H67 Q71 56 71 60 Q71 63 67 64 H33 Q29 63 29 60 Q29 56 33 56Z','top-band')}
      ${light('M35 59H55')}
      ${shell('M50 17 C43 25 32 34 31 43 C30 49 35 56 42 56 H58 C65 56 70 49 69 43 C68 34 57 25 50 17 Z','bishop-head')}
      ${shade('M54 24 Q68 40 61 51 Q67 50 67 43 Q65 33 54 24Z')}
      ${light('M44 29Q38 36 37 42','head-gloss')}
      ${stroke('M59 28L45 50','bishop-slit')}
      <circle class="shell orb" cx="50" cy="13" r="7"/>
      ${light('M47 10Q49 8 51 9','orb-shine')}
    `,
    Q: `
      ${body.narrow}
      ${shell('M33 49H67 Q71 49 71 53 Q71 56 67 57 H33 Q29 56 29 53 Q29 49 33 49Z','top-band')}
      ${light('M34 52H55')}
      ${shell('M29 46 L19 28 Q18 25 21 24 L35 33 L45 24 Q48 21 50 26 L55 24 L65 33 L79 24 Q82 25 81 28 L71 46 Q68 49 63 49 H37 Q32 49 29 46 Z','queen-crown')}
      ${shade('M67 33L75 29L69 45H59Z')}
      ${light('M30 38Q40 44 52 43','crown-gloss')}
      ${stroke('M34 47H66','crown-rim')}
      <circle class="shell orb" cx="50" cy="18" r="7"/>
      ${light('M47 15L50 14','orb-shine')}
    `,
    K: `
      ${body.narrow}
      ${shell('M33 49H67 Q71 49 71 53 Q71 57 67 58 H33 Q29 57 29 53 Q29 49 33 49Z','top-band')}
      ${light('M34 52H55')}
      ${shell('M30 34 Q30 28 37 28 H63 Q70 28 70 34 L64 48 H36 Z','king-crown')}
      ${shade('M59 33H67L62 46H57Z')}
      ${light('M36 33Q43 30 49 32','crown-gloss')}
      ${shell('M46 7 H54 V16 H62 V24 H54 V32 H46 V24 H38 V16 H46 Z','king-cross')}
      ${light('M48 10V18 M49 19H57','cross-gloss')}
    `,
    N: `
      ${body.sturdy}
      ${shell('M27 57 Q35 50 39 46 L34 39 L21 45 Q13 46 12 40 Q8 34 15 29 L30 18 L34 13 Q38 9 42 13 L50 22 Q61 21 67 31 Q75 44 70 76 H37 Q34 68 27 57 Z','knight-head')}
      ${shade('M60 31 Q74 47 67 73 H58 Q65 52 60 31 Z')}
      ${light('M19 32L30 25 M42 40Q36 51 43 62','horse-gloss')}
      ${stroke('M55 24 Q72 44 67 63','mane-line')}
      ${stroke('M61 31L67 37 M62 40L69 46 M62 49L69 55','mane-notches')}
      <circle class="eye" cx="35" cy="34" r="2.6"/>
      <circle class="nose" cx="16" cy="39" r="2"/>
      ${stroke('M23 49Q32 52 37 47','mouth')}
    `
  };

  // Small art-specific engravings intentionally do not change the overall
  // profile or height of a piece (and never introduce shiny jewels).
  const ornaments = {
    classic: '',
    dragons: `<g class="engrave theme-dragons">
      ${stroke('M46 63Q50 58 54 63 M44 70Q50 65 56 70','detail-line')}
      ${light('M35 90L44 90','edge-mark')}
      </g>`,
    fortress: `<g class="engrave theme-fortress">
      ${stroke('M45 64H55 M43 69H57','detail-line')}
      <circle class="rivet" cx="35" cy="80" r="1.45"/><circle class="rivet" cx="65" cy="80" r="1.45"/>
      </g>`,
    cosmos: `<g class="engrave theme-cosmos">
      ${stroke('M42 67Q50 60 58 67Q50 74 42 67Z','orbit')}
      <circle class="starlight" cx="50" cy="66" r="1.7" />
      </g>`,
    mystic: `<g class="engrave theme-mystic">
      ${stroke('M46 62Q41 69 50 71Q59 69 54 62','detail-line')}
      <circle class="starlight" cx="50" cy="65" r="1.3"/>
      </g>`,
    pixel: `<g class="engrave theme-pixel">
      <rect class="pixel-mark" x="46" y="64" width="3" height="3" rx=".4" />
      <rect class="pixel-mark" x="51" y="67" width="3" height="3" rx=".4" />
      ${light('M22 103H31','pixel-shine')}
      </g>`,
    celestial: `<g class="engrave theme-celestial">
      ${stroke('M50 60V64 M50 70V74 M43 67H46 M54 67H57','sun-rays')}
      <circle class="starlight" cx="50" cy="67" r="2.1"/>
      </g>`,
    abyss: `<g class="engrave theme-abyss">
      ${stroke('M44 62L49 71 M50 61L55 70','claw-marks')}
      </g>`
  };

  const accents = {
    classic: '#f3f0e5',
    dragons: '#ffcb96',
    fortress: '#e1eaf0',
    cosmos: '#bddafc',
    mystic: '#e9c9fa',
    pixel: '#f3f3f3',
    celestial: '#ffe2a1',
    abyss: '#c5b4e5'
  };

  function get(type, skin='classic') {
    const kind=Object.prototype.hasOwnProperty.call(heads,type)?type:'P';
    const theme=Object.prototype.hasOwnProperty.call(ornaments,skin)?skin:'classic';
    const id=`bc-piece-${++nextId}`;
    const el=document.createElement('span');
    el.className=`art art-${theme}`;
    // Gradients are unique for each SVG, so a board can show many player colors
    // without different pieces accidentally sharing the first gradient's color.
    el.innerHTML=`<svg viewBox="0 0 100 116" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${id}-paint" x1="0%" y1="6%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".66"/>
          <stop offset="26%" stop-color="currentColor"/>
          <stop offset="69%" stop-color="currentColor"/>
          <stop offset="100%" stop-color="#050809" stop-opacity=".86"/>
        </linearGradient>
        <radialGradient id="${id}-round" cx="30%" cy="20%" r="82%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".82"/>
          <stop offset="35%" stop-color="currentColor"/>
          <stop offset="100%" stop-color="#111915" stop-opacity=".89"/>
        </radialGradient>
      </defs>
      <style>
        .shell{fill:url(#${id}-paint);stroke:#141b19;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
        .shell.orb{fill:url(#${id}-round)}
        .top-band,.lower-band{stroke-width:3.4}
        .ink{fill:none;stroke:#17201b;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:.65}
        .highlight{fill:none;stroke:#ffffff;stroke-width:3.1;stroke-linecap:round;stroke-linejoin:round;opacity:.45}
        .shade{fill:#060b0a;opacity:.13}
        .eye,.nose{fill:#151d19}
        .engrave .ink{stroke:${accents[theme]};stroke-width:1.7;opacity:.65}
        .engrave .highlight{stroke:${accents[theme]};opacity:.7}
        .rivet,.pixel-mark,.starlight{fill:${accents[theme]};opacity:.78}
      </style>
      <g class="chessman">${heads[kind]}${base}${ornaments[theme]||''}</g>
    </svg>`;
    return el;
  }
  return {get};
})();
