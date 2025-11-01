export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    background: string;
    text: string;
    textMuted: string;
  };
  backgroundImage?: string;
}

export const defaultTheme: Theme = {
  name: 'Default',
  colors: {
    primary: '#6ED3B5',       // mint-green
    secondary: '#4A90E2',      // deep-sky-blue
    accent: '#CBA6F7',        // soft-lavender
    highlight: '#FFCBA4',      // warm-peach
    background: '#F9F9F9',    // ivory-white
    text: '#4B4B4B',          // slate-gray
    textMuted: '#4B4B4B80',   // slate-gray with alpha
  },
};


// ASIA
export const australiaTheme: Theme = {
  name: 'Australia',
  colors: {
    primary: '#FFB300',
    secondary: '#0072C6',
    accent: '#00A651',
    highlight: '#E94B3C',
    background: '#FFF8E1',
    text: '#222222',
    textMuted: '#22222280',
  },
   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230072C6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export const chinaTheme: Theme = {
  name: 'China',
  colors: {
    primary: '#DE2910',
    secondary: '#FFDE00',
    accent: '#8A1538',
    highlight: '#D4AF37',
    background: '#FFF5E6',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const hongKongTheme: Theme = {
  name: 'Hong Kong',
  colors: {
    primary: '#C8102E',
    secondary: '#FFFFFF',
    accent: '#0072BC',
    highlight: '#F2C100',
    background: '#F5F5F5',
    text: '#000000',
    textMuted: '#00000080',
  },
};

export const indiaTheme: Theme = {
  name: 'India',
  colors: {
    primary: '#FF9933',
    secondary: '#138808',
    accent: '#FFFFFF',
    highlight: '#000080',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const indonesiaTheme: Theme = {
  name: 'Indonesia',
  colors: {
    primary: '#E30613',
    secondary: '#FFFFFF',
    accent: '#0066B3',
    highlight: '#009639',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const israelTheme: Theme = {
  name: 'Israel',
  colors: {
    primary: '#0038B8',
    secondary: '#FFFFFF',
    accent: '#007A33',
    highlight: '#D9D9D9',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const japanTheme: Theme = {
  name: 'Japan',
  colors: {
    primary: '#BC002D',
    secondary: '#FFFFFF',
    accent: '#000000',
    highlight: '#F4D5B3',
    background: '#FFF5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18.2c0 .8-.2 1.5-.5 2.2-.3.7-.7 1.4-1.2 2-.5.6-1 1.2-1.7 1.7-.7.5-1.4 1-2.2 1.2-.8.3-1.5.5-2.4.5M3.5 14c0 .8.2 1.5.5 2.2.3.7.7 1.4 1.2 2 .5.6 1 1.2 1.7 1.7.7.5 1.4 1 2.2 1.2.8.3 1.5.5 2.4.5M14 3.5c.8 0 1.5.2 2.2.5.7.3 1.4.7 2 1.2.6.5 1.2 1 1.7 1.7.5.7 1 1.4 1.2 2.2.3.8.5 1.5.5 2.4M14 24.5c.8 0 1.5-.2 2.2-.5.7-.3 1.4-.7 2-1.2.6-.5 1.2-1 1.7-1.7.5-.7 1-1.4 1.2-2.2.3-.8.5-1.5.5-2.4M18.2 11c.8 0 1.5.2 2.2.5.7.3 1.4.7 2 1.2.6.5 1.2 1 1.7 1.7.5.7 1 1.4 1.2 2.2.3.8.5 1.5.5 2.4M3.5 14c-.8 0-1.5-.2-2.2-.5-.7-.3-1.4-.7-2-1.2C-.3 11.8-.8 11.2-1.2 10.5c-.5-.7-.7-1.4-.7-2.2 0-.8.2-1.5.5-2.2.3-.7.7-1.4 1.2-2 .5-.6 1-1.2 1.7-1.7.7-.5 1.4-1 2.2-1.2.8-.3 1.5-.5 2.4-.5M24.5 14c.8 0 1.5.2 2.2.5.7.3 1.4.7 2 1.2.6.5 1.2 1 1.7 1.7.5.7 1 1.4 1.2 2.2.3.8.5 1.5.5 2.4M14 24.5c.8 0 1.5-.2 2.2-.5.7-.3 1.4-.7 2-1.2.6-.5 1.2-1 1.7-1.7.5-.7 1-1.4 1.2-2.2.3-.8.5-1.5.5-2.4M18.2 11c-.8 0-1.5-.2-2.2-.5-.7-.3-1.4-.7-2-1.2-.6-.5-1.2-1-1.7-1.7-.5-.7-1-1.4-1.2-2.2C11.2 4.3 11 3.6 11 2.8c0 .8-.2 1.5-.5 2.2-.3.7-.7 1.4-1.2 2-.5.6-1 1.2-1.7 1.7-.7.5-1.4 1-2.2 1.2C4.3 11.2 3.6 11 2.8 11c.8 0 1.5.2 2.2.5.7.3 1.4.7 2 1.2.6.5 1.2 1 1.7 1.7.5.7 1 1.4 1.2 2.2.3.8.5 1.5.5 2.4M11 18.2c0-.8.2-1.5.5-2.2.3-.7.7-1.4 1.2-2 .5-.6 1-1.2 1.7-1.7.7-.5 1.4-1 2.2-1.2.8-.3 1.5-.5 2.4-.5' fill-opacity='0.05' fill='%23BC002D'/%3E%3C/svg%3E")`,
};

export const laosTheme: Theme = {
  name: 'Laos',
  colors: {
    primary: '#002868',
    secondary: '#FFD700',
    accent: '#A52A2A',
    highlight: '#87CEEB',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const macauTheme: Theme = {
  name: 'Macau',
  colors: {
    primary: '#FFD700',
    secondary: '#C8102E',
    accent: '#000000',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const malaysiaTheme: Theme = {
  name: 'Malaysia',
  colors: {
    primary: '#014B87',
    secondary: '#E30A17',
    accent: '#FFD700',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const philippinesTheme: Theme = {
  name: 'Philippines',
  colors: {
    primary: '#0038A8',
    secondary: '#CE1126',
    accent: '#FCD116',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const saudiArabiaTheme: Theme = {
  name: 'Saudi Arabia',
  colors: {
    primary: '#006C35',
    secondary: '#FFFFFF',
    accent: '#C0B283',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const southKoreaTheme: Theme = {
  name: 'South Korea',
  colors: {
    primary: '#003478',
    secondary: '#C60C30',
    accent: '#FFFFFF',
    highlight: '#F7F7F7',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
   backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C60C30' fill-opacity='0.05'%3E%3Ccircle cx='50' cy='50' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
};

export const taiwanTheme: Theme = {
  name: 'Taiwan',
  colors: {
    primary: '#FF0000',
    secondary: '#0000FF',
    accent: '#FFFF00',
    highlight: '#FFFFFF',
    background: '#FFF5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const thailandTheme: Theme = {
  name: 'Thailand',
  colors: {
    primary: '#0072BC',
    secondary: '#FECB00',
    accent: '#E30613',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const vietnamTheme: Theme = {
  name: 'Vietnam',
  colors: {
    primary: '#DA251D',
    secondary: '#FFDE00',
    accent: '#008000',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

// EUROPE & OTHERS
export const albaniaTheme: Theme = {
  name: 'Albania',
  colors: {
    primary: '#E41B17',
    secondary: '#000000',
    accent: '#FFD700',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const belgiumTheme: Theme = {
  name: 'Belgium',
  colors: {
    primary: '#FFD100',
    secondary: '#000000',
    accent: '#FF0000',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const bulgariaTheme: Theme = {
  name: 'Bulgaria',
  colors: {
    primary: '#00966E',
    secondary: '#FFFFFF',
    accent: '#FF0000',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const cyprusTheme: Theme = {
  name: 'Cyprus',
  colors: {
    primary: '#0073CF',
    secondary: '#FFD700',
    accent: '#FFFFFF',
    highlight: '#008000',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const denmarkTheme: Theme = {
  name: 'Denmark',
  colors: {
    primary: '#C60C30',
    secondary: '#FFFFFF',
    accent: '#002868',
    highlight: '#F7F7F7',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const egyptTheme: Theme = {
  name: 'Egypt',
  colors: {
    primary: '#CE7B00',
    secondary: '#000000',
    accent: '#FFFFFF',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#4B4B4B',
    textMuted: '#4B4B4B80',
  },
};

export const franceTheme: Theme = {
  name: 'France',
  colors: {
    primary: '#0055A4',
    secondary: '#EF4135',
    accent: '#FFFFFF',
    highlight: '#F7F7F7',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%230055a4' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 6h4v4H6V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zm10 0h4v4h-4V6zM6 16h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 26h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 36h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 46h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 56h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 66h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 76h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zM6 86h4v4H6v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export const germanyTheme: Theme = {
  name: 'Germany',
  colors: {
    primary: '#000000',
    secondary: '#FFCE00',
    accent: '#DD0000',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const greeceTheme: Theme = {
  name: 'Greece',
  colors: {
    primary: '#0D5EAF',
    secondary: '#FFFFFF',
    accent: '#FFDE00',
    highlight: '#000000',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const italyTheme: Theme = {
  name: 'Italy',
  colors: {
    primary: '#008C45',
    secondary: '#F4F5F0',
    accent: '#CD212A',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23cd212a' fill-opacity='0.05'%3E%3Cpath d='M0 50h50v50H0z'/%3E%3Cpath d='M100 50h-50v50h50z'/%3E%3C/g%3E%3C/svg%3E")`,
};

export const russiaTheme: Theme = {
  name: 'Russia',
  colors: {
    primary: '#D52B1E',
    secondary: '#FFFFFF',
    accent: '#0033A0',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const romaniaTheme: Theme = {
  name: 'Romania',
  colors: {
    primary: '#002B7F',
    secondary: '#FBE100',
    accent: '#D81E05',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const spainTheme: Theme = {
  name: 'Spain',
  colors: {
    primary: '#AA151B',
    secondary: '#F1BF00',
    accent: '#000000',
    highlight: '#FFFFFF',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const swedenTheme: Theme = {
  name: 'Sweden',
  colors: {
    primary: '#005CBF',
    secondary: '#FECC00',
    accent: '#FFFFFF',
    highlight: '#000000',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const switzerlandTheme: Theme = {
  name: 'Switzerland',
  colors: {
    primary: '#FF0000',
    secondary: '#FFFFFF',
    accent: '#000000',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const turkeyTheme: Theme = {
  name: 'Turkey',
  colors: {
    primary: '#E30A17',
    secondary: '#FFFFFF',
    accent: '#008000',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
};

export const unitedKingdomTheme: Theme = {
  name: 'United Kingdom',
  colors: {
    primary: '#012169',
    secondary: '#C8102E',
    accent: '#E0E0E0',
    highlight: '#FFD700',
    background: '#F5F5F5',
    text: '#222222',
    textMuted: '#22222280',
  },
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23012169' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6h2c0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6zM26 26c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6h2c0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6zM52 26c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6h2c0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6zM39 22c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4-3.314 0-6 2.686-6 6h2c0-2.21 1.79-4 4-4 3.314 0 6-2.686 6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};


const countryNameToCodeMap: Record<string, string> = {
    'australia': 'AU',
    'china': 'CN',
    'hong kong': 'HK',
    'india': 'IN',
    'indonesia': 'ID',
    'israel': 'IL',
    'japan': 'JP',
    'laos': 'LA',
    'macau': 'MO',
    'malaysia': 'MY',
    'philippines': 'PH',
    'saudi arabia': 'SA',
    'south korea': 'KR',
    'taiwan': 'TW',
    'thailand': 'TH',
    'vietnam': 'VN',
    'albania': 'AL',
    'belgium': 'BE',
    'bulgaria': 'BG',
    'cyprus': 'CY',
    'denmark': 'DK',
    'egypt': 'EG',
    'france': 'FR',
    'germany': 'DE',
    'greece': 'GR',
    'italy': 'IT',
    'russia': 'RU',
    'romania': 'RO',
    'spain': 'ES',
    'sweden': 'SE',
    'switzerland': 'CH',
    'turkey': 'TR',
    'united kingdom': 'GB',
};

const countryCodeToThemeMap: Record<string, Theme> = {
  'AU': australiaTheme,
  'CN': chinaTheme,
  'HK': hongKongTheme,
  'IN': indiaTheme,
  'ID': indonesiaTheme,
  'IL': israelTheme,
  'JP': japanTheme,
  'LA': laosTheme,
  'MO': macauTheme,
  'MY': malaysiaTheme,
  'PH': philippinesTheme,
  'SA': saudiArabiaTheme,
  'KR': southKoreaTheme,
  'TW': taiwanTheme,
  'TH': thailandTheme,
  'VN': vietnamTheme,
  'AL': albaniaTheme,
  'BE': belgiumTheme,
  'BG': bulgariaTheme,
  'CY': cyprusTheme,
  'DK': denmarkTheme,
  'EG': egyptTheme,
  'FR': franceTheme,
  'DE': germanyTheme,
  'GR': greeceTheme,
  'IT': italyTheme,
  'RU': russiaTheme,
  'RO': romaniaTheme,
  'ES': spainTheme,
  'SE': swedenTheme,
  'CH': switzerlandTheme,
  'TR': turkeyTheme,
  'GB': unitedKingdomTheme,
};

export const getThemeForCountry = (countryNameOrCode: string): Theme => {
  // First try as country code (uppercase 2-letter code)
  if (countryNameOrCode.length === 2 && countryNameOrCode === countryNameOrCode.toUpperCase()) {
    const theme = countryCodeToThemeMap[countryNameOrCode];
    if (theme) return theme;
  }
  
  // Try as country name
  const code = countryNameToCodeMap[countryNameOrCode.toLowerCase()];
  if (code) {
    return countryCodeToThemeMap[code] || defaultTheme;
  }
  
  // Default fallback
  return defaultTheme;
};

// Helper to get theme directly from country code
export const getThemeForCountryCode = (countryCode: string): Theme => {
  return countryCodeToThemeMap[countryCode] || defaultTheme;
};
