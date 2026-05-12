// icons.jsx — shared inline SVG icons. All stroke-based, 1.5px stroke for clarity.

const Icon = ({ d, size = 16, fill = 'none', stroke = 'currentColor', sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const IconMap = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </>} />
);
const IconCompare = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M4 6h7" /><path d="M4 12h7" /><path d="M4 18h7" />
    <path d="M16 6h4" /><path d="M16 12h4" /><path d="M16 18h4" />
  </>} />
);
const IconTrophy = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4a3 3 0 0 0 3 3" />
    <path d="M17 6h3a3 3 0 0 1-3 3" />
    <path d="M10 14h4l-1 4h-2l-1-4Z" />
    <path d="M8 20h8" />
  </>} />
);
const IconLeaf = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" />
    <path d="M5 19c4-4 8-8 14-14" />
  </>} />
);
const IconChart = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" />
  </>} />
);
const IconBike = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <circle cx="6" cy="17" r="3.5" />
    <circle cx="18" cy="17" r="3.5" />
    <path d="M6 17 12 7h4" />
    <path d="m12 7 6 10" />
    <path d="M8 7h4" />
  </>} />
);
const IconTrain = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <rect x="6" y="3" width="12" height="14" rx="2" />
    <path d="M6 11h12" />
    <circle cx="9" cy="14" r=".7" fill="currentColor" />
    <circle cx="15" cy="14" r=".7" fill="currentColor" />
    <path d="m7 21 2-2M17 21l-2-2" />
  </>} />
);
const IconBus = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <rect x="4" y="4" width="16" height="13" rx="2" />
    <path d="M4 11h16" />
    <circle cx="8" cy="20" r="1.4" />
    <circle cx="16" cy="20" r="1.4" />
    <path d="M7 8h3M14 8h3" />
  </>} />
);
const IconCar = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <path d="M4 14v3h16v-3" />
    <path d="m4 14 2-6h12l2 6" />
    <circle cx="7.5" cy="17" r="1.4" />
    <circle cx="16.5" cy="17" r="1.4" />
  </>} />
);
const IconArrow = ({ size = 16 }) => (
  <Icon size={size} d={<path d="M5 12h14M13 6l6 6-6 6" />} />
);
const IconSwap = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <path d="M7 4v16" /><path d="m3 8 4-4 4 4" />
    <path d="M17 20V4" /><path d="m21 16-4 4-4-4" />
  </>} />
);
const IconPlus = ({ size = 14 }) => <Icon size={size} d={<><path d="M12 5v14M5 12h14" /></>} />;
const IconCrosshair = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="2.5" />
  </>} />
);
const IconMinus = ({ size = 14 }) => <Icon size={size} d={<path d="M5 12h14" />} />;
const IconCheck = ({ size = 16 }) => <Icon size={size} sw={2.2} d={<path d="M4 12l5 5L20 6" />} />;
const IconClock = ({ size = 14 }) => (
  <Icon size={size} d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />
);
const IconRoute = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" />
    <path d="M8 6h8a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h8" />
  </>} />
);
const IconCo2 = ({ size = 14 }) => (
  <Icon size={size} d={<><circle cx="12" cy="12" r="9" /><path d="M16 9a4 4 0 1 0 0 6" /></>} />
);
const IconStar = ({ size = 14 }) => (
  <Icon size={size} d={<path d="m12 3 2.6 5.6 6 .9-4.4 4.2 1 6.1L12 17l-5.2 2.8 1-6.1L3.4 9.5l6-.9L12 3Z" />} />
);
const IconLock = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>} />
);
const IconLightning = ({ size = 14 }) => (
  <Icon size={size} fill="currentColor" stroke="none"
    d={<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />} />
);
const IconFlame = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <path d="M12 3c1 4 5 5 5 10a5 5 0 1 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4 0-3 0-5 0-7Z" />
  </>} />
);

Object.assign(window, {
  Icon, IconMap, IconCompare, IconTrophy, IconLeaf, IconChart,
  IconBike, IconTrain, IconBus, IconCar, IconArrow, IconSwap,
  IconPlus, IconMinus, IconCheck, IconClock, IconRoute, IconCo2,
  IconStar, IconLock, IconLightning, IconFlame, IconCrosshair,
});
