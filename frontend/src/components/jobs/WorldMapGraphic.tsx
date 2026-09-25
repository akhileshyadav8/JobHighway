import React from "react";

export function WorldMapGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Soft radial ambient glow */}
        <radialGradient id="worldMapGlow" cx="55%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#0d9488" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
        </radialGradient>

        {/* Trajectory path gradients */}
        <linearGradient id="mapFlightPath1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#0d9488" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="mapFlightPath2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <rect width="1000" height="500" fill="url(#worldMapGlow)" />

      {/* Vector World Map Continents in subtle faint mint/teal */}
      <g fill="#0d9488" fillOpacity="0.11" stroke="#0d9488" strokeOpacity="0.08" strokeWidth="0.8" strokeLinejoin="round">
        {/* North America */}
        <path d="M 125,50 C 145,45 175,42 205,52 C 235,62 250,75 260,95 C 270,115 272,130 262,145 C 252,160 238,168 230,185 C 222,202 215,225 200,242 C 190,253 182,248 178,238 C 172,224 165,210 152,205 C 139,200 120,205 110,195 C 98,183 95,160 90,145 C 84,126 80,110 88,95 C 96,80 110,55 125,50 Z" />
        {/* Alaska */}
        <path d="M 60,65 C 75,55 92,58 105,70 C 100,82 85,92 72,95 C 60,98 52,88 52,78 C 52,70 55,68 60,65 Z" />
        {/* Canadian Arctic Islands */}
        <path d="M 180,32 C 195,28 215,30 220,40 C 215,48 198,52 188,48 C 178,44 175,35 180,32 Z" />
        <path d="M 230,35 C 242,32 255,38 250,48 C 242,55 232,50 230,35 Z" />
        {/* Greenland */}
        <path d="M 310,25 C 330,20 360,25 368,45 C 372,60 365,85 348,95 C 335,102 320,98 312,85 C 305,72 300,35 310,25 Z" />
        {/* Central America & Caribbean */}
        <path d="M 198,245 C 205,255 212,265 218,278 C 212,282 205,274 200,265 C 195,255 194,248 198,245 Z" />
        <path d="M 235,232 C 245,230 255,235 250,242 C 242,245 235,240 235,232 Z" />
        {/* South America */}
        <path d="M 220,285 C 242,280 270,295 285,315 C 300,335 308,365 300,395 C 290,425 272,460 255,482 C 248,490 242,482 238,465 C 232,438 222,400 216,365 C 210,330 212,300 220,285 Z" />

        {/* Europe */}
        <path d="M 450,85 C 470,72 505,70 530,78 C 550,85 565,105 558,125 C 550,140 532,152 510,155 C 490,158 472,148 460,135 C 450,122 445,100 450,85 Z" />
        {/* Scandinavia */}
        <path d="M 480,45 C 495,38 515,42 522,55 C 525,68 518,90 508,95 C 498,92 488,75 482,62 C 478,52 475,48 480,45 Z" />
        {/* United Kingdom & Ireland */}
        <path d="M 432,95 C 440,90 448,96 445,108 C 442,118 435,124 430,118 C 425,112 425,100 432,95 Z" />
        <path d="M 418,102 C 424,98 428,104 426,112 C 422,116 416,114 416,108 C 416,104 417,103 418,102 Z" />
        {/* Mediterranean islands */}
        <path d="M 478,162 C 484,160 488,164 486,168 C 482,172 476,170 478,162 Z" />

        {/* Africa */}
        <path d="M 465,175 C 495,168 540,172 565,195 C 590,215 605,248 610,282 C 615,320 600,365 578,400 C 560,428 540,445 520,442 C 502,438 488,408 478,375 C 466,335 452,295 448,255 C 445,215 452,185 465,175 Z" />
        {/* Madagascar */}
        <path d="M 622,370 C 628,362 636,370 634,388 C 630,405 622,415 618,408 C 614,400 616,380 622,370 Z" />

        {/* Asia (Russia, China, Central Asia, Siberia) */}
        <path d="M 565,72 C 615,55 690,50 760,58 C 825,65 890,82 925,110 C 955,135 945,165 915,182 C 885,198 845,205 815,215 C 790,222 765,250 750,280 C 738,302 718,310 705,292 C 695,280 680,250 665,225 C 650,202 622,195 598,188 C 575,180 558,160 560,135 C 562,112 555,88 565,72 Z" />
        {/* Arabian Peninsula */}
        <path d="M 575,185 C 595,180 615,192 625,210 C 632,225 630,242 618,252 C 605,260 590,255 582,242 C 572,228 568,200 575,185 Z" />
        {/* Indian Subcontinent */}
        <path d="M 660,215 C 678,220 695,238 700,260 C 705,285 692,315 678,335 C 668,348 660,345 652,328 C 642,305 638,275 640,250 C 642,228 650,215 660,215 Z" />
        {/* Sri Lanka */}
        <path d="M 680,345 C 685,340 690,344 688,352 C 686,358 680,360 678,355 C 676,350 678,346 680,345 Z" />
        {/* Japan Archipelago */}
        <path d="M 915,155 C 925,148 935,155 932,170 C 928,185 918,202 910,198 C 905,192 905,165 915,155 Z" />
        <path d="M 928,125 C 935,120 942,126 940,135 C 936,142 930,140 928,125 Z" />
        {/* Southeast Asia (Indochina, Malaysia) */}
        <path d="M 745,245 C 760,240 775,255 780,272 C 778,285 765,295 752,305 C 742,300 738,285 740,270 C 742,255 744,248 745,245 Z" />
        {/* Indonesia & Philippines */}
        <path d="M 780,320 C 802,315 830,320 840,332 C 835,342 812,348 792,345 C 778,342 774,328 780,320 Z" />
        <path d="M 830,275 C 840,268 850,274 848,288 C 842,300 832,305 828,295 C 825,285 825,278 830,275 Z" />

        {/* Australia */}
        <path d="M 825,370 C 858,352 902,358 932,378 C 960,398 965,432 950,460 C 932,485 895,495 860,490 C 828,485 805,460 808,430 C 810,400 808,380 825,370 Z" />
        {/* New Zealand */}
        <path d="M 975,465 C 982,458 990,465 986,480 C 980,492 972,496 970,486 C 968,476 970,470 975,465 Z" />
      </g>

      {/* Subtle Data Trajectory Connections between ATS Career Portals */}
      <g strokeWidth="1" strokeLinecap="round" fill="none">
        {/* US West Coast -> Europe Hub */}
        <path d="M 180,165 Q 320,80 480,120" stroke="url(#mapFlightPath1)" strokeDasharray="4 4" />
        {/* Europe Hub -> India ATS Center */}
        <path d="M 490,125 Q 570,140 660,260" stroke="url(#mapFlightPath2)" strokeDasharray="3 3" />
        {/* US West -> Asia East Hub */}
        <path d="M 220,185 Q 460,50 780,170" stroke="url(#mapFlightPath1)" strokeDasharray="5 5" />
        {/* India -> Australia Hub */}
        <path d="M 665,270 Q 760,310 850,400" stroke="url(#mapFlightPath2)" strokeDasharray="3 4" />
      </g>

      {/* Primary Data Anchors (Tech Cities with major ATS hubs) */}
      <g>
        {/* San Francisco / US West */}
        <circle cx="165" cy="170" r="2.5" fill="#0d9488" fillOpacity="0.5" />
        {/* New York / US East */}
        <circle cx="235" cy="160" r="2.5" fill="#0d9488" fillOpacity="0.5" />
        {/* London / Europe */}
        <circle cx="440" cy="115" r="2.5" fill="#0d9488" fillOpacity="0.5" />
        {/* Bengaluru / India */}
        <circle cx="660" cy="275" r="2.5" fill="#0d9488" fillOpacity="0.6" />
        {/* Tokyo / East Asia */}
        <circle cx="918" cy="175" r="2.5" fill="#0d9488" fillOpacity="0.5" />
        {/* Sydney / Australia */}
        <circle cx="895" cy="440" r="2.5" fill="#0d9488" fillOpacity="0.4" />
      </g>
    </svg>
  );
}
