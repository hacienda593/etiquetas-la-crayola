export type TemplateData = {
  nombre: string;
  apellido: string;
  unidad: string;
  grado: string;
  whatsapp: string;
};

export type Template = {
  id: string;
  nombre: string;
  categoria: "nino" | "nina" | "joven_hombre" | "joven_mujer";
  componente: React.FC<TemplateData>;
};

const W = 400;
const H = 200;
const ICON_W = 90;
const TEXT_X = 100;
const QR_SIZE = 82;
const QR_X = W - QR_SIZE - 14;
const QR_Y = H - QR_SIZE - 4;
const TEXT_MAX = QR_X - TEXT_X - 6;

// ── Helpers de texto ─────────────────────────────────────────────────────────
function splitUnidad(unidad: string) {
  const up = unidad.toUpperCase();
  if (up.length <= 20) return [up, ""];
  const mid = Math.floor(up.length / 2);
  const cut = up.lastIndexOf(" ", mid) > 4 ? up.lastIndexOf(" ", mid) : up.indexOf(" ", mid);
  return cut > 0 ? [up.slice(0, cut), up.slice(cut + 1)] : [up.slice(0, 20) + "…", ""];
}

// ── Info (con ícono, QR condicional) ─────────────────────────────────────────
const Info = ({ nombre, apellido, unidad, grado, whatsapp }: TemplateData) => {
  const hasQR = whatsapp.replace(/\D/g, "").length > 8 && whatsapp !== "593999999999";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=164x164&data=${encodeURIComponent(`https://wa.me/${whatsapp}`)}&color=000000&bgcolor=ffffff&qzone=1`;

  const maxLen = Math.max(nombre.length, apellido.length);
  const nameFZ = maxLen > 12 ? 25 : maxLen > 8 ? 30 : 36;

  const [unL1, unL2] = splitUnidad(unidad);
  const unFZ = 16;
  const grFZ = 20;
  const twoL = unL2 !== "";

  const nameY = 42;
  const divY  = nameY + nameFZ * 2 + 6;
  const unY   = divY + 18;
  const grY   = unY + (twoL ? unFZ * 2 + 5 : unFZ + 3) + 16;
  const txMax = hasQR ? TEXT_MAX : W - TEXT_X - 8;

  return (
    <g>
      <line x1={TEXT_X-5} y1="10" x2={TEXT_X-5} y2={H-10} stroke="black" strokeWidth="0.8" opacity="0.12"/>
      <text x={TEXT_X} y={nameY} fontSize={nameFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{nombre.toUpperCase()}</text>
      <text x={TEXT_X} y={nameY+nameFZ+4} fontSize={nameFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{apellido.toUpperCase()}</text>
      <line x1={TEXT_X} y1={divY} x2={TEXT_X+txMax} y2={divY} stroke="black" strokeWidth="1" opacity="0.2"/>
      <text x={TEXT_X} y={unY} fontSize={unFZ} fontWeight="700" fontFamily="Arial,sans-serif" fill="#444">{unL1}</text>
      {twoL && <text x={TEXT_X} y={unY+unFZ+2} fontSize={unFZ} fontWeight="700" fontFamily="Arial,sans-serif" fill="#444">{unL2}</text>}
      <text x={TEXT_X} y={grY} fontSize={grFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{grado.toUpperCase()}</text>
      {hasQR && <>
        <rect x={QR_X-2} y={QR_Y-2} width={QR_SIZE+4} height={QR_SIZE+4} fill="white"/>
        <image href={qrUrl} x={QR_X} y={QR_Y} width={QR_SIZE} height={QR_SIZE}/>
      </>}
    </g>
  );
};

// ── InfoFull (sin ícono, texto desde el borde) ───────────────────────────────
const InfoFull = ({ nombre, apellido, unidad, grado, whatsapp }: TemplateData) => {
  const hasQR = whatsapp.replace(/\D/g, "").length > 8 && whatsapp !== "593999999999";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=164x164&data=${encodeURIComponent(`https://wa.me/${whatsapp}`)}&color=000000&bgcolor=ffffff&qzone=1`;

  const maxLen = Math.max(nombre.length, apellido.length);
  const nameFZ = maxLen > 12 ? 28 : maxLen > 8 ? 34 : 40;

  const [unL1, unL2] = splitUnidad(unidad);
  const unFZ = 16;
  const grFZ = 20;
  const twoL = unL2 !== "";
  const x0 = 14;
  const txMax = hasQR ? QR_X - x0 - 6 : W - x0 - 8;

  const nameY = 42;
  const divY  = nameY + nameFZ * 2 + 6;
  const unY   = divY + 18;
  const grY   = unY + (twoL ? unFZ * 2 + 5 : unFZ + 3) + 16;

  return (
    <g>
      <text x={x0} y={nameY} fontSize={nameFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{nombre.toUpperCase()}</text>
      <text x={x0} y={nameY+nameFZ+4} fontSize={nameFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{apellido.toUpperCase()}</text>
      <line x1={x0} y1={divY} x2={x0+txMax} y2={divY} stroke="black" strokeWidth="1" opacity="0.2"/>
      <text x={x0} y={unY} fontSize={unFZ} fontWeight="700" fontFamily="Arial,sans-serif" fill="#444">{unL1}</text>
      {twoL && <text x={x0} y={unY+unFZ+2} fontSize={unFZ} fontWeight="700" fontFamily="Arial,sans-serif" fill="#444">{unL2}</text>}
      <text x={x0} y={grY} fontSize={grFZ} fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" fill="#000">{grado.toUpperCase()}</text>
      {hasQR && <>
        <rect x={QR_X-2} y={QR_Y-2} width={QR_SIZE+4} height={QR_SIZE+4} fill="white"/>
        <image href={qrUrl} x={QR_X} y={QR_Y} width={QR_SIZE} height={QR_SIZE}/>
      </>}
    </g>
  );
};

// ── Wrappers ─────────────────────────────────────────────────────────────────
const Etiqueta = ({ children, data, borde="solid" }: { children: React.ReactNode; data: TemplateData; borde?: "solid"|"dash"|"double" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <defs><clipPath id="clip-icon"><rect x="4" y="4" width={ICON_W-4} height={H-8} rx="4"/></clipPath></defs>
    <rect width={W} height={H} fill="white"/>
    {borde==="dash" && <rect x="3" y="3" width={W-6} height={H-6} fill="none" stroke="black" strokeWidth="1" rx="4" strokeDasharray="6 4"/>}
    {borde==="double" && <rect x="3" y="3" width={W-6} height={H-6} fill="none" stroke="black" strokeWidth="0.8" rx="4"/>}
    <g clipPath="url(#clip-icon)">{children}</g>
    <Info {...data}/>
  </svg>
);

const EtiquetaSimple = ({ data, borde="dash" }: { data: TemplateData; borde?: "solid"|"dash"|"double" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width={W} height={H} fill="white"/>
    {borde==="dash" && <rect x="3" y="3" width={W-6} height={H-6} fill="none" stroke="black" strokeWidth="1" rx="4" strokeDasharray="6 4"/>}
    {borde==="double" && <rect x="3" y="3" width={W-6} height={H-6} fill="none" stroke="black" strokeWidth="0.8" rx="4"/>}
    {borde==="solid" && <rect x="3" y="3" width={W-6} height={H-6} fill="none" stroke="black" strokeWidth="1.5" rx="4"/>}
    <InfoFull {...data}/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// NIÑO
// ═══════════════════════════════════════════════════════════════════════════

const NinoDino: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    {[20,60,100,140,180].map(y=>[15,50,80].map(x=><circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="black" opacity="0.1"/>))}
    <g transform="translate(45,100) scale(0.52)">
      <ellipse cx="0" cy="30" rx="42" ry="30" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-10" y="-16" width="20" height="50" rx="8" fill="white" stroke="black" strokeWidth="3.5"/>
      <ellipse cx="0" cy="-36" rx="28" ry="20" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="10" cy="-42" r="5" fill="black"/><circle cx="11" cy="-43" r="2" fill="white"/>
      <path d="M-14 -22 L-8 -16 L-2 -22 L4 -16 L10 -22" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M-8 -56 L-4 -68 L4 -76 L12 -80 L18 -72" fill="black"/>
      <path d="M-42 20 Q-65 30 -62 14 Q-55 2 -42 10" fill="none" stroke="black" strokeWidth="3"/>
      <rect x="-36" y="56" width="14" height="30" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="-14" y="58" width="14" height="28" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="8" y="58" width="14" height="28" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="30" y="56" width="14" height="30" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="-18" y="-62" width="36" height="8" rx="2" fill="black"/>
      <rect x="-8" y="-76" width="16" height="16" rx="2" fill="black"/>
      <line x1="18" y1="-62" x2="28" y2="-48" stroke="black" strokeWidth="2"/>
      <circle cx="28" cy="-46" r="4" fill="black"/>
    </g>
  </Etiqueta>
);

const NinoFutbol: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.72)">
      <circle cx="0" cy="-10" r="55" fill="white" stroke="black" strokeWidth="3.5"/>
      <polygon points="0,-52 16,-40 16,-22 0,-10 -16,-22 -16,-40" fill="black"/>
      <polygon points="0,-10 16,-22 34,-16 36,4 22,16 0,10" fill="none" stroke="black" strokeWidth="2"/>
      <polygon points="0,-10 -16,-22 -34,-16 -36,4 -22,16 0,10" fill="none" stroke="black" strokeWidth="2"/>
      <text x="-50" y="-60" fontSize="18" fill="black">★</text>
      <text x="34" y="70" fontSize="14" fill="black">★</text>
    </g>
  </Etiqueta>
);

const NinoRobot: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <line x1="0" y1="-92" x2="0" y2="-74" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="0" cy="-96" r="7" fill="black"/>
      <rect x="-34" y="-74" width="68" height="52" rx="8" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-28" y="-60" width="18" height="14" rx="3" fill="black"/>
      <rect x="10" y="-60" width="18" height="14" rx="3" fill="black"/>
      <circle cx="-19" cy="-53" r="4" fill="white"/><circle cx="19" cy="-53" r="4" fill="white"/>
      <rect x="-24" y="-40" width="48" height="10" rx="3" fill="black"/>
      <line x1="-14" y1="-40" x2="-14" y2="-30" stroke="white" strokeWidth="2"/>
      <line x1="0" y1="-40" x2="0" y2="-30" stroke="white" strokeWidth="2"/>
      <line x1="14" y1="-40" x2="14" y2="-30" stroke="white" strokeWidth="2"/>
      <rect x="-10" y="-22" width="20" height="12" rx="2" fill="black"/>
      <rect x="-44" y="-10" width="88" height="70" rx="6" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-30" y="2" width="60" height="44" rx="4" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="-14" cy="18" r="9" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="-14" cy="18" r="4" fill="black"/>
      <rect x="4" y="8" width="20" height="10" rx="2" fill="black"/>
      <rect x="-64" y="-6" width="20" height="50" rx="7" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="44" y="-6" width="20" height="50" rx="7" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="-38" y="60" width="26" height="32" rx="4" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="12" y="60" width="26" height="32" rx="4" fill="white" stroke="black" strokeWidth="3"/>
    </g>
  </Etiqueta>
);

const NinoEspacio: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    {[[15,20],[30,55],[12,90],[25,130],[10,165],[60,40],[80,160]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2" fill="black" opacity="0.2"/>
    ))}
    <g transform="translate(45,100) scale(0.6)">
      <path d="M0,-78 Q24,-58 24,20 L24,68 Q24,80 0,84 Q-24,80 -24,68 L-24,20 Q-24,-58 0,-78Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="-10" r="20" fill="white" stroke="black" strokeWidth="3"/>
      <circle cx="0" cy="-10" r="12" fill="black"/>
      <circle cx="5" cy="-16" r="4" fill="white"/>
      <path d="M-24,50 L-46,80 L-24,72Z" fill="black"/>
      <path d="M24,50 L46,80 L24,72Z" fill="black"/>
      <path d="M-18,84 Q0,104 18,84" fill="black"/>
      <circle cx="72" cy="-60" r="22" fill="none" stroke="black" strokeWidth="2.5"/>
      <ellipse cx="72" cy="-60" rx="32" ry="9" fill="none" stroke="black" strokeWidth="2"/>
    </g>
  </Etiqueta>
);

// NIÑO 5 — Tiburón
const NinoTiburon: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,108) scale(0.56)">
      <ellipse cx="0" cy="0" rx="58" ry="30" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-20,-30 L-10,-80 L10,-30Z" fill="black" stroke="black" strokeWidth="2"/>
      <path d="M-58,0 Q-78,-10 -74,8 Q-70,24 -58,14Z" fill="black"/>
      <path d="M58,0 L80,-14 L80,14 L58,10Z" fill="black"/>
      <circle cx="20" cy="-10" r="6" fill="black"/>
      <circle cx="22" cy="-12" r="2" fill="white"/>
      <path d="M-30,14 L-22,24 L-12,14 L0,24 L12,14 L22,24 L30,14" fill="none" stroke="black" strokeWidth="2.5"/>
      <line x1="-58" y1="0" x2="58" y2="0" stroke="black" strokeWidth="1" opacity="0.3"/>
    </g>
  </Etiqueta>
);

// NIÑO 6 — Superhéroe
const NinoSuperheroe: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,100) scale(0.52)">
      <ellipse cx="0" cy="-60" rx="26" ry="28" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-30" y="-76" width="60" height="22" rx="6" fill="black"/>
      <circle cx="-12" cy="-62" r="7" fill="white"/>
      <circle cx="12" cy="-62" r="7" fill="white"/>
      <circle cx="-12" cy="-62" r="3" fill="black"/>
      <circle cx="12" cy="-62" r="3" fill="black"/>
      <path d="M-8,-44 Q0,-40 8,-44" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M-26,-32 L-30,40 L0,20 L30,40 L26,-32Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <polygon points="0,-12 -8,4 0,0 8,4" fill="black"/>
      <path d="M-30,10 Q-60,-10 -80,30 L-30,40Z" fill="black" stroke="black" strokeWidth="2"/>
      <path d="M30,10 Q60,-10 80,30 L30,40Z" fill="black" stroke="black" strokeWidth="2"/>
      <rect x="-16" y="40" width="14" height="50" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="2" y="40" width="14" height="50" rx="5" fill="white" stroke="black" strokeWidth="3"/>
    </g>
  </Etiqueta>
);

// NIÑO 7 — Tren
const NinoTren: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,105) scale(0.48)">
      <rect x="-60" y="-50" width="120" height="80" rx="10" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-60" y="-70" width="50" height="24" rx="6" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="-54" y="-64" width="38" height="12" rx="3" fill="black"/>
      <path d="M-10,-58 L-10,-46" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <rect x="-48" y="-28" width="34" height="30" rx="4" fill="black"/>
      <rect x="4" y="-28" width="34" height="30" rx="4" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="-34" cy="-13" r="9" fill="white"/>
      <circle cx="21" cy="-13" r="9" fill="white"/>
      <circle cx="-40" cy="36" r="18" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-40" cy="36" r="8" fill="black"/>
      <circle cx="40" cy="36" r="18" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="40" cy="36" r="8" fill="black"/>
      <line x1="-60" y1="30" x2="60" y2="30" stroke="black" strokeWidth="2"/>
      <line x1="60" y1="-50" x2="70" y2="-50" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </Etiqueta>
);

// NIÑO 8 — León
const NinoLeon: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.54)">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>(
        <ellipse key={a} cx={Math.cos(a*Math.PI/180)*46} cy={Math.sin(a*Math.PI/180)*46}
          rx="16" ry="10" transform={`rotate(${a})`} fill={a%60===0?"black":"none"} stroke="black" strokeWidth="2"/>
      ))}
      <circle cx="0" cy="0" r="38" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-12" cy="-10" r="8" fill="black"/>
      <circle cx="12" cy="-10" r="8" fill="black"/>
      <circle cx="-10" cy="-8" r="3" fill="white"/>
      <circle cx="10" cy="-8" r="3" fill="white"/>
      <ellipse cx="0" cy="10" rx="12" ry="8" fill="black"/>
      <ellipse cx="0" cy="10" rx="8" ry="5" fill="white"/>
      <path d="M-6,16 Q0,22 6,16" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M-20,-28 L-28,-42 L-14,-36Z" fill="black"/>
      <path d="M20,-28 L28,-42 L14,-36Z" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑO 9 — Pingüino
const NinoPinguino: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,105) scale(0.54)">
      <ellipse cx="0" cy="20" rx="36" ry="56" fill="black" stroke="black" strokeWidth="3"/>
      <ellipse cx="0" cy="20" rx="22" ry="42" fill="white"/>
      <circle cx="0" cy="-46" r="28" fill="black" stroke="black" strokeWidth="3"/>
      <ellipse cx="0" cy="-46" rx="16" ry="18" fill="white"/>
      <circle cx="-8" cy="-52" r="5" fill="black"/>
      <circle cx="8" cy="-52" r="5" fill="black"/>
      <circle cx="-6" cy="-50" r="2" fill="white"/>
      <circle cx="6" cy="-50" r="2" fill="white"/>
      <ellipse cx="0" cy="-36" rx="8" ry="5" fill="black"/>
      <path d="-36,0 Q-52,-10 -54,14 Q-52,28 -36,30Z" fill="black"/>
      <path d="M-36,0 Q-54,-10 -54,14 Q-52,28 -36,30Z" fill="black"/>
      <path d="M36,0 Q54,-10 54,14 Q52,28 36,30Z" fill="black"/>
      <path d="M-14,72 L-20,86 L-8,86Z" fill="black"/>
      <path d="M14,72 L8,86 L20,86Z" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑO 10 — Barco Pirata
const NinoBarco: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,105) scale(0.5)">
      <path d="M-60,20 Q-60,60 -40,70 L40,70 Q60,60 60,20Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <line x1="0" y1="-80" x2="0" y2="20" stroke="black" strokeWidth="4" strokeLinecap="round"/>
      <path d="M0,-80 L50,-40 L0,-10Z" fill="black" stroke="black" strokeWidth="1.5"/>
      <path d="M0,-80 L-50,-40 L0,-10Z" fill="white" stroke="black" strokeWidth="1.5"/>
      <rect x="-14" y="-100" width="28" height="18" rx="3" fill="black"/>
      <circle cx="0" cy="-96" r="6" fill="white"/>
      <line x1="-6" y1="-96" x2="6" y2="-96" stroke="black" strokeWidth="2"/>
      <line x1="0" y1="-102" x2="0" y2="-90" stroke="black" strokeWidth="2"/>
      <line x1="-60" y1="20" x2="60" y2="20" stroke="black" strokeWidth="3"/>
      {[-30,0,30].map(x=><line key={x} x1={x} y1="20" x2={x} y2="70" stroke="black" strokeWidth="1.5" opacity="0.3"/>)}
    </g>
  </Etiqueta>
);

// NIÑO 11 — Básquet
const NinoBasquet: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.7)">
      <circle cx="0" cy="0" r="55" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-55,0 Q-20,-40 20,-40 Q55,-20 55,0" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M-55,0 Q-20,40 20,40 Q55,20 55,0" fill="none" stroke="black" strokeWidth="2.5"/>
      <line x1="0" y1="-55" x2="0" y2="55" stroke="black" strokeWidth="2.5"/>
      <line x1="-55" y1="0" x2="55" y2="0" stroke="black" strokeWidth="2.5"/>
      <path d="M-20,-55 Q0,-30 20,-55" fill="none" stroke="black" strokeWidth="2"/>
      <path d="M-20,55 Q0,30 20,55" fill="none" stroke="black" strokeWidth="2"/>
      <text x="-46" y="-62" fontSize="16" fill="black">★</text>
      <text x="30" y="76" fontSize="13" fill="black">★</text>
    </g>
  </Etiqueta>
);

// NIÑO 12 — Solo texto
const NinoTexto: React.FC<TemplateData> = (p) => <EtiquetaSimple data={p} borde="dash"/>;

// ═══════════════════════════════════════════════════════════════════════════
// NIÑA
// ═══════════════════════════════════════════════════════════════════════════

const NinaUnicornio: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,106) scale(0.5)">
      <ellipse cx="0" cy="30" rx="50" ry="34" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M12,-8 Q28,-24 22,-48 Q16,-64 0,-66 Q-16,-64 -20,-48 Q-24,-24 -8,-8Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="-82" r="28" fill="white" stroke="black" strokeWidth="3.5"/>
      <polygon points="0,-118 -8,-96 8,-96" fill="black"/>
      <path d="M-10,-86 Q0,-92 10,-86" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="0" cy="-84" r="2" fill="black"/>
      <path d="M-22,-64 L-30,-80 L-12,-72Z" fill="black"/>
      <path d="M22,-64 L30,-80 L12,-72Z" fill="black"/>
      <path d="M-22,-76 Q-34,-60 -30,-44 Q-36,-56 -32,-36" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      {[-38,-16,8,30].map((x,i)=>(
        <rect key={i} x={x} y="62" width="16" height="44" rx="5" fill="white" stroke="black" strokeWidth="3"/>
      ))}
      <path d="M-50,24 Q-72,12 -70,30 Q-72,48 -54,44" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    </g>
  </Etiqueta>
);

const NinaFlores: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(6,6) scale(0.66)">
      <path d="M54,186 Q48,140 52,100 Q56,60 48,16" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40,140 Q20,120 16,100" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M46,100 Q26,82 28,62" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      {[[14,96,1],[26,60,0],[62,22,1],[18,138,0],[52,166,1]].map(([x,y,f],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          {[0,45,90,135,180,225,270,315].map(a=>(
            <ellipse key={a} cx={Math.cos(a*Math.PI/180)*10} cy={Math.sin(a*Math.PI/180)*10} rx="7" ry="4" transform={`rotate(${a})`} fill={f?"black":"none"} stroke="black" strokeWidth="1.5"/>
          ))}
          <circle cx="0" cy="0" r="5" fill={f?"white":"black"} stroke="black" strokeWidth="1.5"/>
        </g>
      ))}
      <g transform="translate(80,110)">
        <path d="M0,0 Q-22,-22 -30,-4 Q-22,12 0,0Z" fill="none" stroke="black" strokeWidth="2.5"/>
        <path d="M0,0 Q22,-22 30,-4 Q22,12 0,0Z" fill="none" stroke="black" strokeWidth="2.5"/>
        <ellipse cx="0" cy="10" rx="3" ry="12" fill="black"/>
      </g>
    </g>
  </Etiqueta>
);

const NinaEstrellas: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,100) scale(0.6)">
      <path d="M-20,-80 Q30,-60 28,10 Q26,80 -22,88 Q-60,70 -56,10 Q-54,-60 -20,-80Z" fill="black"/>
      <path d="M-8,-76 Q30,-58 28,10 Q26,74 -10,84 Q-42,72 -42,10 Q-42,-56 -8,-76Z" fill="white"/>
      {[[48,-68,16],[60,10,11],[44,76,13],[72,-20,8],[-60,-30,7],[-60,60,9]].map(([x,y,r],i)=>{
        const pts=Array.from({length:5},(_,k)=>{const a=k*72-90;const b=a+36;return `${x+(r as number)*Math.cos(a*Math.PI/180)},${y+(r as number)*Math.sin(a*Math.PI/180)} ${x+((r as number)*0.4)*Math.cos(b*Math.PI/180)},${y+((r as number)*0.4)*Math.sin(b*Math.PI/180)}`;}).join(' ');
        return <polygon key={i} points={pts} fill={i%2===0?"black":"none"} stroke="black" strokeWidth="1.5"/>;
      })}
    </g>
  </Etiqueta>
);

const NinaHada: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(6,6) scale(0.64)">
      <line x1="80" y1="178" x2="42" y2="60" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="42,42 46,56 60,56 50,66 54,80 42,70 30,80 34,66 24,56 38,56" fill="black"/>
      {[[16,26],[70,20],[90,80],[8,90],[60,138],[96,152]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y-9} x2={x} y2={y+9} stroke="black" strokeWidth={i%2?1.5:2} strokeLinecap="round"/>
          <line x1={x-9} y1={y} x2={x+9} y2={y} stroke="black" strokeWidth={i%2?1.5:2} strokeLinecap="round"/>
        </g>
      ))}
    </g>
  </Etiqueta>
);

// NIÑA 5 — Mariposa
const NinaMariposa: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,100) scale(0.58)">
      <path d="M0,0 Q-60,-80 -80,-40 Q-90,10 -60,30 Q-30,50 0,10Z" fill="black" stroke="black" strokeWidth="2"/>
      <path d="M0,0 Q-40,20 -50,60 Q-44,80 -20,70 Q10,56 0,10Z" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M0,0 Q60,-80 80,-40 Q90,10 60,30 Q30,50 0,10Z" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M0,0 Q40,20 50,60 Q44,80 20,70 Q-10,56 0,10Z" fill="black" stroke="black" strokeWidth="2"/>
      <ellipse cx="0" cy="5" rx="5" ry="20" fill="black"/>
      <line x1="-6" y1="-4" x2="-22" y2="-22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="-4" x2="22" y2="-22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="-24" cy="-24" r="3" fill="black"/>
      <circle cx="24" cy="-24" r="3" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑA 6 — Gato con lazo
const NinaGato: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,105) scale(0.52)">
      <circle cx="0" cy="0" r="40" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-30,-30 L-44,-62 L-10,-38Z" fill="black" stroke="black" strokeWidth="1.5"/>
      <path d="M30,-30 L44,-62 L10,-38Z" fill="black" stroke="black" strokeWidth="1.5"/>
      <ellipse cx="-14" cy="-8" rx="10" ry="12" fill="black"/>
      <ellipse cx="14" cy="-8" rx="10" ry="12" fill="black"/>
      <circle cx="-14" cy="-8" r="5" fill="white"/>
      <circle cx="14" cy="-8" r="5" fill="white"/>
      <ellipse cx="0" cy="14" rx="10" ry="7" fill="black"/>
      <ellipse cx="0" cy="14" rx="6" ry="4" fill="white"/>
      <path d="M-6,20 Q0,26 6,20" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      {[-30,-16,-2,2,16,30].map((x,i)=>(
        <line key={i} x1={x} y1="10" x2={x+(i<3?-20:20)} y2="8" stroke="black" strokeWidth="1.5"/>
      ))}
      <path d="M-20,-50 Q0,-44 20,-50 Q10,-38 0,-40 Q-10,-38 -20,-50Z" fill="black"/>
      <circle cx="0" cy="-44" r="5" fill="white" stroke="black" strokeWidth="1.5"/>
    </g>
  </Etiqueta>
);

// NIÑA 7 — Helado
const NinaHelado: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,108) scale(0.54)">
      <path d="M-24,10 L0,90 L24,10Z" fill="white" stroke="black" strokeWidth="3"/>
      {[-16,0,16].map(x=><line key={x} x1={x} y1="10" x2={x<0?x+8:x>0?x-8:x} y2="90" stroke="black" strokeWidth="1" opacity="0.4"/>)}
      <circle cx="-16" cy="-10" r="26" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="16" cy="-10" r="26" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="-30" r="26" fill="black" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="-30" r="16" fill="white"/>
      <ellipse cx="-16" cy="-8" rx="26" ry="8" fill="black"/>
      <path d="M-6,-52 Q0,-58 6,-52" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="30" cy="-54" r="5" fill="black"/>
      <line x1="30" y1="-54" x2="30" y2="-66" stroke="black" strokeWidth="2"/>
      <circle cx="30" cy="-66" r="3" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑA 8 — Conejo
const NinaConejo: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,106) scale(0.5)">
      <ellipse cx="-12" cy="-80" rx="8" ry="28" fill="white" stroke="black" strokeWidth="3"/>
      <ellipse cx="12" cy="-80" rx="8" ry="28" fill="white" stroke="black" strokeWidth="3"/>
      <ellipse cx="-12" cy="-82" rx="4" ry="22" fill="black"/>
      <ellipse cx="12" cy="-82" rx="4" ry="22" fill="black"/>
      <circle cx="0" cy="-46" r="30" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-10" cy="-54" r="6" fill="black"/>
      <circle cx="10" cy="-54" r="6" fill="black"/>
      <circle cx="-8" cy="-52" r="2.5" fill="white"/>
      <circle cx="8" cy="-52" r="2.5" fill="white"/>
      <circle cx="0" cy="-42" r="5" fill="black"/>
      <path d="M-6,-38 Q0,-32 6,-38" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="0" cy="14" rx="34" ry="44" fill="white" stroke="black" strokeWidth="3.5"/>
      <ellipse cx="0" cy="10" rx="20" ry="32" fill="black" opacity="0.08"/>
      <path d="-36,30 Q-52,20 -50,38 Q-48,52 -36,46Z" fill="black"/>
      <path d="M-36,30 Q-54,20 -50,38 Q-48,52 -36,46Z" fill="black"/>
      <path d="M36,30 Q54,20 50,38 Q48,52 36,46Z" fill="black"/>
      <circle cx="-4" cy="-42" r="3" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑA 9 — Zapatilla de Ballet
const NinaBallet: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.56)">
      <path d="M-40,-20 Q-50,10 -44,40 Q-38,70 0,74 Q40,74 52,54 Q58,40 50,26 Q44,14 28,12 Q10,10 0,20 Q-10,30 -4,44 Q4,58 20,58 Q36,58 40,46" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-40,-20 Q-20,-52 10,-54 Q34,-56 44,-36 Q50,-20 44,-8 Q38,4 28,6" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-36,-18 Q-16,-48 10,-50 Q32,-52 40,-36" fill="none" stroke="black" strokeWidth="1.5" opacity="0.3"/>
      <line x1="10" y1="-54" x2="0" y2="-88" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="-54" x2="28" y2="-84" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      {[[-60,-40],[-70,-10],[-68,24],[-46,58],[60,50],[70,20],[66,-14],[52,-50]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="black" opacity="0.2"/>
      ))}
    </g>
  </Etiqueta>
);

// NIÑA 10 — Castillo
const NinaCastillo: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="double">
    <g transform="translate(45,105) scale(0.48)">
      <rect x="-60" y="10" width="120" height="80" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-60" y="-10" width="30" height="26" rx="2" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="30" y="-10" width="30" height="26" rx="2" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="-20" y="-20" width="40" height="36" rx="2" fill="white" stroke="black" strokeWidth="3"/>
      {[-60,-46,-34].map(x=><rect key={x} x={x} y="-22" width="10" height="14" rx="1" fill="black"/>)}
      {[30,44,56].map(x=><rect key={x} x={x} y="-22" width="10" height="14" rx="1" fill="black"/>)}
      {[-14,0,14].map(x=><rect key={x} x={x} y="-32" width="10" height="14" rx="1" fill="black"/>)}
      <path d="M0,-44 L-6,-32 L6,-32Z" fill="black"/>
      <rect x="-12" y="30" width="24" height="60" rx="12" fill="black"/>
      <rect x="-32" y="42" width="18" height="28" rx="4" fill="none" stroke="black" strokeWidth="2.5"/>
      <rect x="14" y="42" width="18" height="28" rx="4" fill="none" stroke="black" strokeWidth="2.5"/>
      {[-50,50].map(x=><line key={x} x1={x} y1="10" x2={x} y2="90" stroke="black" strokeWidth="1.5" opacity="0.3"/>)}
    </g>
  </Etiqueta>
);

// NIÑA 11 — Oso Panda
const NinaPanda: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,105) scale(0.52)">
      <ellipse cx="0" cy="20" rx="42" ry="52" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="-44" r="32" fill="white" stroke="black" strokeWidth="3.5"/>
      <ellipse cx="-20" cy="-56" rx="14" ry="10" fill="black"/>
      <ellipse cx="20" cy="-56" rx="14" ry="10" fill="black"/>
      <ellipse cx="-12" cy="-48" rx="10" ry="8" fill="black"/>
      <ellipse cx="12" cy="-48" rx="10" ry="8" fill="black"/>
      <circle cx="-10" cy="-46" r="4" fill="white"/>
      <circle cx="10" cy="-46" r="4" fill="white"/>
      <circle cx="-9" cy="-45" r="2" fill="black"/>
      <circle cx="9" cy="-45" r="2" fill="black"/>
      <ellipse cx="0" cy="-28" rx="8" ry="6" fill="black"/>
      <path d="M-5,-24 Q0,-18 5,-24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="-36" cy="10" rx="14" ry="10" fill="black"/>
      <ellipse cx="36" cy="10" rx="14" ry="10" fill="black"/>
      <ellipse cx="-20" cy="60" rx="12" ry="18" fill="black"/>
      <ellipse cx="20" cy="60" rx="12" ry="18" fill="black"/>
    </g>
  </Etiqueta>
);

// NIÑA 12 — Solo texto
const NinaTexto: React.FC<TemplateData> = (p) => <EtiquetaSimple data={p} borde="double"/>;

// ═══════════════════════════════════════════════════════════════════════════
// JOVEN HOMBRE
// ═══════════════════════════════════════════════════════════════════════════

const JovenQuimica: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    {[[20,30,55,65],[20,100,55,130],[20,160,55,140],[75,40,100,70],[75,160,100,130]].map(([x1,y1,x2,y2],i)=>(
      <g key={i} opacity="0.2">
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2"/>
        <circle cx={x1} cy={y1} r="7" fill="black"/>
        <circle cx={x2} cy={y2} r="6" fill="none" stroke="black" strokeWidth="2"/>
      </g>
    ))}
    <g transform="translate(45,100) scale(0.6)">
      <path d="M-22,-72 L-22,-18 L-50,56 Q-52,68 -34,72 L34,72 Q52,68 50,56 L22,-18 L22,-72Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <line x1="-28" y1="-72" x2="28" y2="-72" stroke="black" strokeWidth="4" strokeLinecap="round"/>
      <path d="M-46,46 Q-42,32 -22,24 L22,24 Q42,32 46,46 Q48,68 34,72 L-34,72 Q-48,68 -46,46Z" fill="black"/>
      <circle cx="-12" cy="10" r="6" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="8" cy="-4" r="5" fill="none" stroke="black" strokeWidth="2"/>
    </g>
  </Etiqueta>
);

const JovenGaming: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <path d="M-58,-28 Q-60,-50 -46,-58 L46,-58 Q60,-50 58,-28 L50,28 Q48,46 36,46 Q24,38 0,30 Q-24,38 -36,46 Q-48,46 -50,28Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-36" cy="-18" r="16" fill="none" stroke="black" strokeWidth="2.5"/>
      <circle cx="-36" cy="-18" r="7" fill="black"/>
      <rect x="-50" y="4" width="12" height="32" rx="2" fill="black"/>
      <rect x="-58" y="12" width="28" height="12" rx="2" fill="black"/>
      <circle cx="36" cy="-30" r="8" fill="black"/>
      <circle cx="50" cy="-16" r="8" fill="none" stroke="black" strokeWidth="3"/>
      <circle cx="36" cy="-2" r="8" fill="none" stroke="black" strokeWidth="3"/>
      <circle cx="22" cy="-16" r="8" fill="black"/>
      <circle cx="36" cy="20" r="12" fill="none" stroke="black" strokeWidth="2.5"/>
      <circle cx="36" cy="20" r="6" fill="black"/>
    </g>
  </Etiqueta>
);

const JovenMusica: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <ellipse cx="0" cy="52" rx="38" ry="46" fill="white" stroke="black" strokeWidth="3.5"/>
      <ellipse cx="0" cy="-10" rx="28" ry="34" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="52" r="15" fill="none" stroke="black" strokeWidth="3"/>
      <rect x="-7" y="-90" width="14" height="80" rx="4" fill="white" stroke="black" strokeWidth="3.5"/>
      {[-76,-60,-44].map((y,i)=>(
        <g key={i}><circle cx="-14" cy={y} r="5" fill="black"/><circle cx="14" cy={y} r="5" fill="black"/></g>
      ))}
      {[-5,-2,1,4,7,10].map((x,i)=>(
        <line key={i} x1={x} y1="-90" x2={x-i} y2="94" stroke="black" strokeWidth="1"/>
      ))}
    </g>
  </Etiqueta>
);

const JovenTech: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.54)">
      <rect x="-58" y="-74" width="116" height="78" rx="8" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-50" y="-66" width="100" height="62" rx="4" fill="black"/>
      {[[-40,-54,60,6],[-40,-42,44,6],[-40,-30,72,6],[-40,-18,50,6],[-40,-6,38,6]].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="white" opacity={0.7-i*0.08}/>
      ))}
      <rect x="-10" y="4" width="20" height="20" rx="2" fill="none" stroke="black" strokeWidth="3"/>
      <rect x="-28" y="22" width="56" height="8" rx="4" fill="black"/>
      <g transform="translate(0,66)">
        <circle cx="0" cy="0" r="20" fill="none" stroke="black" strokeWidth="3.5"/>
        <circle cx="0" cy="0" r="9" fill="none" stroke="black" strokeWidth="3"/>
        {[0,45,90,135,180,225,270,315].map(a=>(
          <rect key={a} x="-5" y="-26" width="10" height="10" rx="2" fill="black" transform={`rotate(${a})`}/>
        ))}
      </g>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 5 — Básquet
const JHBasquet: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.62)">
      <circle cx="0" cy="0" r="52" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-52,0 Q-16,-36 16,-36 Q52,-18 52,0" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M-52,0 Q-16,36 16,36 Q52,18 52,0" fill="none" stroke="black" strokeWidth="2.5"/>
      <line x1="0" y1="-52" x2="0" y2="52" stroke="black" strokeWidth="2.5"/>
      <line x1="-52" y1="0" x2="52" y2="0" stroke="black" strokeWidth="2.5"/>
      <rect x="-16" y="-80" width="32" height="8" fill="black"/>
      <rect x="-4" y="-72" width="8" height="22" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 6 — Skate
const JHSkate: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.54)">
      <path d="M-60,20 Q-60,36 -44,36 L44,36 Q60,36 60,20 L56,-4 Q52,-14 44,-14 L-44,-14 Q-52,-14 -56,-4Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-38" cy="42" r="12" fill="white" stroke="black" strokeWidth="3"/>
      <circle cx="-38" cy="42" r="5" fill="black"/>
      <circle cx="38" cy="42" r="12" fill="white" stroke="black" strokeWidth="3"/>
      <circle cx="38" cy="42" r="5" fill="black"/>
      {[-36,-12,12,36].map(x=><line key={x} x1={x} y1="-14" x2={x} y2="22" stroke="black" strokeWidth="1.5" opacity="0.3"/>)}
      <path d="M-30,-30 L-10,-80 L0,-60 L10,-80 L30,-30" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 7 — Código
const JHCodigo: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.56)">
      <rect x="-64" y="-80" width="128" height="160" rx="10" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-56" y="-72" width="112" height="144" rx="6" fill="black"/>
      <text x="-42" y="-44" fontSize="22" fontFamily="monospace" fill="white" fontWeight="bold">{"<"}/{">"}</text>
      {[[-44,-22,60],[-44,-4,44],[-44,14,52],[-44,32,38],[-44,50,56]].map(([x,y,w],i)=>(
        <rect key={i} x={x} y={y} width={w} height="8" rx="2" fill="white" opacity={0.6-i*0.06}/>
      ))}
      <rect x="-8" y="50" width="20" height="8" rx="2" fill="white" opacity="0.9"/>
      <circle cx="0" cy="88" r="10" fill="none" stroke="black" strokeWidth="3"/>
      <rect x="-18" y="94" width="36" height="6" rx="3" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 8 — Montaña
const JHMontana: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    {[[10,160],[20,140],[15,120],[30,180],[8,100]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="1.5" fill="black" opacity="0.2"/>
    ))}
    <g transform="translate(45,110) scale(0.58)">
      <path d="M-70,60 L-10,-80 L0,-60 L16,-90 L70,60Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-10,-80 L-22,-60 L0,-60 L16,-90 L4,-70 L0,-60Z" fill="black"/>
      <path d="M-70,60 L-38,0 L-10,30 L10,10 L40,60Z" fill="none" stroke="black" strokeWidth="1.5" opacity="0.3"/>
      <line x1="-70" y1="60" x2="70" y2="60" stroke="black" strokeWidth="2.5"/>
      <circle cx="46" cy="-30" r="14" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M40,-42 Q46,-52 52,-42" fill="none" stroke="black" strokeWidth="2"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 9 — Boxeo
const JHBoxeo: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,108) scale(0.5)">
      <path d="M-30,-80 Q-50,-80 -50,-50 L-50,40 Q-50,60 -30,64 L30,64 Q50,60 50,40 L50,-50 Q50,-80 30,-80Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-50,-30 Q-70,-30 -70,-10 Q-70,10 -50,10Z" fill="white" stroke="black" strokeWidth="3"/>
      <path d="M50,-30 Q70,-30 70,-10 Q70,10 50,10Z" fill="white" stroke="black" strokeWidth="3"/>
      <line x1="-50" y1="-10" x2="50" y2="-10" stroke="black" strokeWidth="2.5"/>
      <line x1="-50" y1="20" x2="50" y2="20" stroke="black" strokeWidth="2"/>
      <rect x="-30" y="-80" width="60" height="20" rx="4" fill="black"/>
      <line x1="-4" y1="-100" x2="4" y2="-100" stroke="black" strokeWidth="6" strokeLinecap="round"/>
      <line x1="0" y1="-80" x2="0" y2="-100" stroke="black" strokeWidth="3"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 10 — Auto F1
const JHAuto: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,108) scale(0.52)">
      <path d="M-70,10 Q-70,-10 -50,-14 L-20,-14 Q-10,-30 0,-32 Q10,-30 20,-14 L60,-14 Q74,-10 74,10 L70,30 Q60,38 -60,38 Q-70,30 -70,10Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-20,-14 Q-10,-30 0,-32 Q10,-30 20,-14Z" fill="black"/>
      <circle cx="-44" cy="38" r="18" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-44" cy="38" r="8" fill="black"/>
      <circle cx="44" cy="38" r="18" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="44" cy="38" r="8" fill="black"/>
      <rect x="-70" y="2" width="14" height="18" rx="3" fill="black"/>
      <rect x="56" y="2" width="18" height="14" rx="3" fill="black"/>
      <line x1="-60" y1="10" x2="-24" y2="10" stroke="black" strokeWidth="2"/>
      <line x1="24" y1="10" x2="60" y2="10" stroke="black" strokeWidth="2"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 11 — Telescopio
const JHTelesc: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,108) scale(0.54)">
      <path d="M-50,-30 L50,-10 L44,14 L-56,-6Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="38" y="-16" width="20" height="32" rx="4" fill="white" stroke="black" strokeWidth="2.5"/>
      <ellipse cx="-54" cy="-18" rx="8" ry="14" fill="none" stroke="black" strokeWidth="2.5"/>
      <line x1="0" y1="2" x2="10" y2="50" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="-30" y1="50" x2="50" y2="50" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="10" y1="50" x2="-8" y2="80" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <line x1="10" y1="50" x2="28" y2="80" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="60" cy="-50" r="12" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="72" cy="-64" r="6" fill="black"/>
      <circle cx="44" cy="-36" r="4" fill="black"/>
      <circle cx="20" cy="-62" r="3" fill="black" opacity="0.5"/>
    </g>
  </Etiqueta>
);

// JOVEN HOMBRE 12 — Solo texto
const JHTexto: React.FC<TemplateData> = (p) => <EtiquetaSimple data={p} borde="solid"/>;

// ═══════════════════════════════════════════════════════════════════════════
// JOVEN MUJER
// ═══════════════════════════════════════════════════════════════════════════

const JovenLunaFlores: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,100) scale(0.62)">
      <path d="M-28,-82 Q30,-60 28,10 Q26,80 -30,86 Q-72,66 -68,10 Q-64,-60 -28,-82Z" fill="black"/>
      <path d="M-14,-78 Q30,-58 28,10 Q26,76 -16,84 Q-52,70 -52,10 Q-52,-56 -14,-78Z" fill="white"/>
      {[[52,-62,14],[66,14,10],[48,80,12],[74,-16,7]].map(([x,y,r],i)=>{
        const pts=Array.from({length:5},(_,k)=>{const a=k*72-90;const b=a+36;return `${x+(r as number)*Math.cos(a*Math.PI/180)},${y+(r as number)*Math.sin(a*Math.PI/180)} ${x+((r as number)*0.42)*Math.cos(b*Math.PI/180)},${y+((r as number)*0.42)*Math.sin(b*Math.PI/180)}`;}).join(' ');
        return <polygon key={i} points={pts} fill={i%2===0?"black":"none"} stroke="black" strokeWidth="1.5"/>;
      })}
    </g>
  </Etiqueta>
);

const JovenCafe: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <rect x="-64" y="-80" width="62" height="86" rx="4" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-64" y="-80" width="12" height="86" rx="2" fill="black"/>
      {[-56,-42,-28,-14,0].map(y=>(
        <line key={y} x1="-46" y1={y} x2="-8" y2={y} stroke="black" strokeWidth="1.5" opacity="0.5"/>
      ))}
      <path d="M-24,18 L-20,72 Q-20,82 0,82 Q20,82 20,72 L24,18Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-22,30 L-18,72 Q-18,78 0,78 Q18,78 18,72 L22,30Z" fill="black"/>
      <path d="M22,32 Q42,32 42,52 Q42,72 22,72" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
      {[-14,0,14].map((x,i)=>(
        <path key={i} d={`M${x},14 Q${x-6},-2 ${x},-14 Q${x+6},-28 ${x},-42`} fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
    </g>
  </Etiqueta>
);

const JovenModa: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <line x1="0" y1="-92" x2="0" y2="-72" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M0,-72 Q0,-80 -26,-60 L-40,-52 L40,-52 L26,-60 Q0,-80 0,-72Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-32,-52 L-38,10 Q-44,30 -50,90 L50,90 Q44,30 38,10 L32,-52Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-38,10 Q0,22 38,10" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M-16,12 Q0,8 16,12 Q8,24 0,20 Q-8,24 -16,12Z" fill="black"/>
      <rect x="44" y="24" width="36" height="46" rx="8" fill="white" stroke="black" strokeWidth="3"/>
      <path d="M50,24 Q62,10 74,24" fill="none" stroke="black" strokeWidth="3"/>
      <circle cx="62" cy="36" r="5" fill="black"/>
    </g>
  </Etiqueta>
);

const JovenVintage: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="double">
    <g transform="translate(45,100) scale(0.52)">
      <rect x="-58" y="-38" width="116" height="76" rx="10" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="0" r="28" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="0" cy="0" r="19" fill="none" stroke="black" strokeWidth="2.5"/>
      <circle cx="0" cy="0" r="10" fill="black"/>
      <circle cx="6" cy="-7" r="4" fill="white"/>
      <rect x="34" y="-32" width="18" height="14" rx="4" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="-40" cy="-38" r="7" fill="black"/>
      <path d="M-58,-22 Q-72,-22 -74,-6 Q-76,10 -74,26 Q-72,42 -58,42" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <path d="M58,-22 Q72,-22 74,-6 Q76,10 74,26 Q72,42 58,42" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 5 — Paleta de pintura
const JMPintura: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.54)">
      <path d="M-10,-80 Q30,-84 54,-58 Q76,-30 70,10 Q64,50 30,62 Q0,72 -20,56 Q-40,40 -36,10 Q-32,-20 -10,-20 Q10,-20 14,0 Q18,20 4,28 Q-10,36 -20,24" fill="white" stroke="black" strokeWidth="3.5"/>
      <circle cx="-36" cy="-36" r="10" fill="black"/>
      <circle cx="-10" cy="-68" r="10" fill="black"/>
      <circle cx="26" cy="-72" r="10" fill="none" stroke="black" strokeWidth="3"/>
      <circle cx="58" cy="-42" r="10" fill="black"/>
      <circle cx="66" cy="-6" r="10" fill="none" stroke="black" strokeWidth="3"/>
      <line x1="30" y1="50" x2="80" y2="90" stroke="black" strokeWidth="8" strokeLinecap="round"/>
      <ellipse cx="84" cy="94" rx="10" ry="6" transform="rotate(45,84,94)" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 6 — Audífonos
const JMAudifonos: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.56)">
      <path d="M-42,0 Q-42,-60 0,-70 Q42,-60 42,0" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round"/>
      <rect x="-58" y="-10" width="28" height="46" rx="12" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-52" y="-4" width="16" height="34" rx="8" fill="black"/>
      <rect x="30" y="-10" width="28" height="46" rx="12" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="36" y="-4" width="16" height="34" rx="8" fill="black"/>
      <path d="M-10,36 Q0,48 10,36" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      {[[-66,-30],[-64,-10],[66,-30],[64,-10]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="black" opacity="0.3"/>
      ))}
    </g>
  </Etiqueta>
);

// JOVEN MUJER 7 — Planta en maceta
const JMPlanta: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,110) scale(0.54)">
      <path d="M-28,10 Q-30,40 -20,50 L20,50 Q30,40 28,10Z" fill="white" stroke="black" strokeWidth="3.5"/>
      <path d="M-32,10 L32,10" stroke="black" strokeWidth="3"/>
      <line x1="0" y1="10" x2="0" y2="-50" stroke="black" strokeWidth="3" strokeLinecap="round"/>
      <path d="M0,-20 Q-40,-20 -44,-54 Q-20,-50 0,-30Z" fill="black"/>
      <path d="M0,-10 Q40,-14 46,-52 Q20,-46 0,-24Z" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M0,-40 Q-30,-50 -26,-80 Q-6,-60 0,-50Z" fill="none" stroke="black" strokeWidth="2.5"/>
      <path d="M0,-44 Q24,-60 20,-88 Q4,-66 0,-54Z" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 8 — Gorro de chef
const JMChef: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.54)">
      <ellipse cx="0" cy="-20" rx="44" ry="54" fill="white" stroke="black" strokeWidth="3.5"/>
      <ellipse cx="0" cy="-20" rx="34" ry="44" fill="none" stroke="black" strokeWidth="1" opacity="0.3"/>
      <rect x="-36" y="28" width="72" height="22" rx="4" fill="black"/>
      <rect x="-40" y="48" width="80" height="16" rx="4" fill="white" stroke="black" strokeWidth="2.5"/>
      <line x1="-20" y1="-60" x2="-20" y2="-20" stroke="black" strokeWidth="1.5" opacity="0.3"/>
      <line x1="0" y1="-64" x2="0" y2="-24" stroke="black" strokeWidth="1.5" opacity="0.3"/>
      <line x1="20" y1="-60" x2="20" y2="-20" stroke="black" strokeWidth="1.5" opacity="0.3"/>
      <path d="M-10,70 L0,90 L10,70" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 9 — Maleta de viaje
const JMMaleta: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="solid">
    <g transform="translate(45,100) scale(0.52)">
      <rect x="-60" y="-40" width="120" height="100" rx="10" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-16" y="-56" width="32" height="20" rx="6" fill="none" stroke="black" strokeWidth="3.5"/>
      <line x1="-60" y1="10" x2="60" y2="10" stroke="black" strokeWidth="2.5"/>
      <line x1="0" y1="-40" x2="0" y2="60" stroke="black" strokeWidth="2"/>
      <rect x="-46" y="-20" width="30" height="20" rx="3" fill="none" stroke="black" strokeWidth="2"/>
      <rect x="16" y="-20" width="30" height="20" rx="3" fill="none" stroke="black" strokeWidth="2"/>
      <circle cx="-54" cy="80" r="10" fill="white" stroke="black" strokeWidth="2.5"/>
      <circle cx="-54" cy="80" r="4" fill="black"/>
      <circle cx="54" cy="80" r="10" fill="white" stroke="black" strokeWidth="2.5"/>
      <circle cx="54" cy="80" r="4" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 10 — Cine / Claqueta
const JMCine: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="double">
    <g transform="translate(45,105) scale(0.5)">
      <rect x="-64" y="0" width="128" height="90" rx="6" fill="white" stroke="black" strokeWidth="3.5"/>
      <rect x="-64" y="-20" width="128" height="26" rx="4" fill="black"/>
      {[-52,-28,-4,20,44].map(x=>(
        <g key={x}>
          <rect x={x} y="-20" width="16" height="12" rx="2" fill="white"/>
          <path d={`M${x},-20 L${x+8},-32 L${x+16},-20`} fill="none" stroke="white" strokeWidth="2"/>
        </g>
      ))}
      {[[-46,18,44,14],[-46,42,44,14],[-46,66,30,14]].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="black" opacity={0.7-i*0.15}/>
      ))}
      <circle cx="42" cy="56" r="18" fill="none" stroke="black" strokeWidth="2.5"/>
      <polygon points="38,48 38,64 54,56" fill="black"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 11 — Flor de loto / Yoga
const JMLoto: React.FC<TemplateData> = (p) => (
  <Etiqueta data={p} borde="dash">
    <g transform="translate(45,108) scale(0.54)">
      {[0,40,80,120,160,200,240,280,320].map(a=>(
        <ellipse key={a} cx={Math.cos((a-90)*Math.PI/180)*36} cy={Math.sin((a-90)*Math.PI/180)*36}
          rx="16" ry="8" transform={`rotate(${a})`}
          fill={a%80===0?"black":"none"} stroke="black" strokeWidth="2"/>
      ))}
      <circle cx="0" cy="0" r="18" fill="white" stroke="black" strokeWidth="3"/>
      <circle cx="0" cy="0" r="8" fill="black"/>
      <path d="M0,-54 Q-10,-72 -4,-86 Q4,-72 0,-54Z" fill="black"/>
      <path d="M0,-54 Q10,-72 4,-86 Q-4,-72 0,-54Z" fill="none" stroke="black" strokeWidth="2"/>
      <line x1="-70" y1="54" x2="70" y2="54" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M-70,54 Q-50,40 -30,54" fill="none" stroke="black" strokeWidth="2"/>
      <path d="M30,54 Q50,40 70,54" fill="none" stroke="black" strokeWidth="2"/>
    </g>
  </Etiqueta>
);

// JOVEN MUJER 12 — Solo texto
const JMTexto: React.FC<TemplateData> = (p) => <EtiquetaSimple data={p} borde="double"/>;

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRO
// ═══════════════════════════════════════════════════════════════════════════
export const TEMPLATES: Template[] = [
  { id: "nino-dino",       nombre: "Dinosaurio",      categoria: "nino",         componente: NinoDino },
  { id: "nino-futbol",     nombre: "Fútbol",          categoria: "nino",         componente: NinoFutbol },
  { id: "nino-robot",      nombre: "Robot",           categoria: "nino",         componente: NinoRobot },
  { id: "nino-espacio",    nombre: "Espacio",         categoria: "nino",         componente: NinoEspacio },
  { id: "nino-tiburon",    nombre: "Tiburón",         categoria: "nino",         componente: NinoTiburon },
  { id: "nino-superheroe", nombre: "Superhéroe",      categoria: "nino",         componente: NinoSuperheroe },
  { id: "nino-tren",       nombre: "Tren",            categoria: "nino",         componente: NinoTren },
  { id: "nino-leon",       nombre: "León",            categoria: "nino",         componente: NinoLeon },
  { id: "nino-pinguino",   nombre: "Pingüino",        categoria: "nino",         componente: NinoPinguino },
  { id: "nino-barco",      nombre: "Barco Pirata",    categoria: "nino",         componente: NinoBarco },
  { id: "nino-basquet",    nombre: "Básquet",         categoria: "nino",         componente: NinoBasquet },
  { id: "nino-texto",      nombre: "Solo texto",      categoria: "nino",         componente: NinoTexto },

  { id: "nina-unicornio",  nombre: "Unicornio",       categoria: "nina",         componente: NinaUnicornio },
  { id: "nina-flores",     nombre: "Flores",          categoria: "nina",         componente: NinaFlores },
  { id: "nina-estrellas",  nombre: "Luna y Estrellas",categoria: "nina",         componente: NinaEstrellas },
  { id: "nina-hada",       nombre: "Hada",            categoria: "nina",         componente: NinaHada },
  { id: "nina-mariposa",   nombre: "Mariposa",        categoria: "nina",         componente: NinaMariposa },
  { id: "nina-gato",       nombre: "Gato",            categoria: "nina",         componente: NinaGato },
  { id: "nina-helado",     nombre: "Helado",          categoria: "nina",         componente: NinaHelado },
  { id: "nina-conejo",     nombre: "Conejo",          categoria: "nina",         componente: NinaConejo },
  { id: "nina-ballet",     nombre: "Ballet",          categoria: "nina",         componente: NinaBallet },
  { id: "nina-castillo",   nombre: "Castillo",        categoria: "nina",         componente: NinaCastillo },
  { id: "nina-panda",      nombre: "Panda",           categoria: "nina",         componente: NinaPanda },
  { id: "nina-texto",      nombre: "Solo texto",      categoria: "nina",         componente: NinaTexto },

  { id: "jh-quimica",      nombre: "Química",         categoria: "joven_hombre", componente: JovenQuimica },
  { id: "jh-gaming",       nombre: "Gaming",          categoria: "joven_hombre", componente: JovenGaming },
  { id: "jh-musica",       nombre: "Música",          categoria: "joven_hombre", componente: JovenMusica },
  { id: "jh-tech",         nombre: "Tech",            categoria: "joven_hombre", componente: JovenTech },
  { id: "jh-basquet",      nombre: "Básquet",         categoria: "joven_hombre", componente: JHBasquet },
  { id: "jh-skate",        nombre: "Skate",           categoria: "joven_hombre", componente: JHSkate },
  { id: "jh-codigo",       nombre: "Código",          categoria: "joven_hombre", componente: JHCodigo },
  { id: "jh-montana",      nombre: "Montaña",         categoria: "joven_hombre", componente: JHMontana },
  { id: "jh-boxeo",        nombre: "Boxeo",           categoria: "joven_hombre", componente: JHBoxeo },
  { id: "jh-auto",         nombre: "Auto F1",         categoria: "joven_hombre", componente: JHAuto },
  { id: "jh-telesc",       nombre: "Telescopio",      categoria: "joven_hombre", componente: JHTelesc },
  { id: "jh-texto",        nombre: "Solo texto",      categoria: "joven_hombre", componente: JHTexto },

  { id: "jm-lunaflores",   nombre: "Luna y Flores",   categoria: "joven_mujer",  componente: JovenLunaFlores },
  { id: "jm-cafe",         nombre: "Café y Libros",   categoria: "joven_mujer",  componente: JovenCafe },
  { id: "jm-moda",         nombre: "Moda",            categoria: "joven_mujer",  componente: JovenModa },
  { id: "jm-vintage",      nombre: "Vintage",         categoria: "joven_mujer",  componente: JovenVintage },
  { id: "jm-pintura",      nombre: "Pintura",         categoria: "joven_mujer",  componente: JMPintura },
  { id: "jm-audifonos",    nombre: "Audífonos",       categoria: "joven_mujer",  componente: JMAudifonos },
  { id: "jm-planta",       nombre: "Planta",          categoria: "joven_mujer",  componente: JMPlanta },
  { id: "jm-chef",         nombre: "Chef",            categoria: "joven_mujer",  componente: JMChef },
  { id: "jm-maleta",       nombre: "Viaje",           categoria: "joven_mujer",  componente: JMMaleta },
  { id: "jm-cine",         nombre: "Cine",            categoria: "joven_mujer",  componente: JMCine },
  { id: "jm-loto",         nombre: "Yoga / Loto",     categoria: "joven_mujer",  componente: JMLoto },
  { id: "jm-texto",        nombre: "Solo texto",      categoria: "joven_mujer",  componente: JMTexto },
];

export const CATEGORIAS = [
  { value: "nino",         label: "👦 Niño",         sub: "Escuela / Primaria" },
  { value: "nina",         label: "👧 Niña",          sub: "Escuela / Primaria" },
  { value: "joven_hombre", label: "🧑 Joven Hombre", sub: "Colegio / Secundaria" },
  { value: "joven_mujer",  label: "👩 Joven Mujer",  sub: "Colegio / Secundaria" },
];
